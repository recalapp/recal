from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseForbidden
from django.views.decorators.http import require_GET
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.core.cache import caches
from django.views.decorators.cache import cache_page, never_cache
from django.core.urlresolvers import reverse
# send regardless of whether Django thinks we should

from view_cache_utils import cache_page_with_prefix
import hashlib

import json

# TODO don't use import *
from models import *  # NOQA

# @ensure_csrf_cookie


def index(request):
    """
    Home page. Show landing page or course selection page, depending on user's state.
    """
    if not request.user.is_authenticated():
        return redirect('landing')

    return render(request, 'main/index.html', {
        'username': unicode(request.user.username)
    })


@login_required
def course_evaluations(request, semester_id, course_id):
    """
    Course evaluations, an iFrame to registrar's
    """
    return render(request, 'main/course_evaluations.html', {
        'semester_id': semester_id,
        'course_id': course_id
    })


def landing(request):
    """
    Displays the landing page.
    """
    return render(request, 'landing/index.html', None)


def status(request):
    """
    Displays the status page.
    """
    return render(request, 'status/index.html', None)


def about(request):
    """
    Displays the about page.
    """
    return render(request, 'landing/about.html', None)


def continuity_check(request):
    """
    This is a continuity check we can trigger that makes sure:
        - number of schedules > 100
        - number of users > 100
        - number of classes > 100

    """

    if Schedule.objects.count() > 100 and Section.objects.count() > 100 and Nice_User.objects.count() > 100:
        return HttpResponse("OK")
    return HttpResponse("Alarm")


def we_sorry(request):
    """
    Displays the sorry announcement page.
    """
    return render(request, 'announcements/we_sorry.html', None)


def hydrate_meeting_dict(meeting):
    return {
        'days': meeting.days,
        'start_time': meeting.start_time,
        'end_time': meeting.end_time,
        'location': meeting.location,
        'id': meeting.id
    }


def hydrate_section_dict(section, course):
    meetings = [hydrate_meeting_dict(meeting)
                for meeting in section.meetings.all()]
    return {
        'id': section.id,
        'name': section.name,
        'section_type': section.section_type,
        'section_capacity': section.section_capacity,
        'section_enrollment': section.section_enrollment,
        'course': "/course_selection/api/v1/course/" + str(course.id) + "/",
        'meetings': meetings
    }


def hydrate_course_listing_dict(course_listing):
    return {
        'dept': course_listing.dept,
        'number': course_listing.number,
        'is_primary': course_listing.is_primary,
    }


def hydrate_semester(semester):
    return {
        'id': semester.id,
        'start_date': unicode(semester.start_date),
        'end_date': unicode(semester.end_date),
        'name': unicode(semester),
        'term_code': semester.term_code
    }


def hydrate_course_dict(course):
    sections = [hydrate_section_dict(section, course)
                for section in course.sections.all()]
    course_listings = [hydrate_course_listing_dict(
        cl) for cl in course.course_listing_set.all()]
    return {
        'course_listings': course_listings,
        'description': course.description,
        'id': course.id,
        'registrar_id': course.registrar_id,
        'title': course.title,
        'sections': sections,
        'semester': hydrate_semester(course.semester),
    }


def get_courses_by_term_code(term_code):
    filtered = Course.objects.filter(Q(semester__term_code=term_code))
    return [hydrate_course_dict(c) for c in filtered]


def hydrate_user_dict(user):
    return {
        'id': user.id,
        'netid': user.netid
    }


@require_GET
@cache_page(60 * 60 * 24)
def get_users_json(request):
    """
    Returns list of all users
    Cached for a day
    """
    results = [hydrate_user_dict(u) for u in Nice_User.objects.all()]
    data = json.dumps(results)
    return HttpResponse(data, 'application/json', status=200)


@require_GET
@cache_page(60 * 30)  # cache for 30 minutes
def get_courses_json(request, term_code):
    """
    Returns list of courses for a semester
    Cached for a day by ?semester__term_code
    """
    data = caches['courses'].get(term_code)
    if data is None:
        results = get_courses_by_term_code(term_code)
        data = json.dumps(results)
        # add doesn't try to set if already exists (i.e. races)
        caches['courses'].add(term_code, data)
    return HttpResponse(data, 'application/json', status=200)


@require_GET
@cache_page_with_prefix(60 * 60 * 24, lambda request: hashlib.md5(request.GET.get('semester__term_code', '')).hexdigest())
def get_courses_json_old(request):
    """
    Returns list of courses for a semester
    Cached for a day by ?semester__term_code
    """
    term_code = request.GET.get('semester__term_code', '')
    results = get_courses_by_term_code(term_code)
    data = json.dumps(results)
    return HttpResponse(data, 'application/json', status=200)


@login_required
def mobile_logged_in(request):
    """Custom log in page handler for iOS app.

    If logged in (i.e. on the way back from CAS), returns username.
    The way to use this is to go to /login?next=mobile_logged_in

    The mobile app detects that we're logged in as soon as the URL changes to /mobile_logged_in.
    At that point it stops and grabs the username from the displayed page.

    """
    # TODO: retrieve Nice_User corresponding to request.user
    nice_user = Nice_User.objects.get(netid=request.user.username)
    return HttpResponse(request.user.username + " " + unicode(nice_user.id))


#############################################################################
# course enrollment form generation
#############################################################################

from pdf import get_template
def get_worksheet_pdf(request, schedule_id, template_name='course_enrollment_worksheet.pdf', **kwargs):

    """
    returns a filled out course enrollment form
    NOTE: use sp to check a checkbox
    """

    # get all the required fields:
    # get user schedule, verify that user has permissions
    #
    # get each course, registrar id and times

    #user = NetID_Name_Table.objects.get(Q(netid=request.user.username))
    try:
        schedule = Schedule.objects.get(Q(id=schedule_id))
        assert schedule.user.netid == request.user.username
    except:
        return HttpResponseNotFound('<h1>Schedule Not Found</h1>')

    context = get_form_context(schedule)

    # context = {
    #     'class': '2016',
    #     'terms': 'sp', # terms is the spring term
    #     'first': 'first_name', #unicode(user.first_name),
    #     'last': 'last_name' #unicode(user.last_name)
    # }

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = \
        'inline; filename=course_enrollment_worksheet.pdf'

    template = get_template(template_name)
    response.write(template.render(context))

    return response


def get_form_context(schedule_obj):
    import json

    context = {}
    context = fill_out_term(context, schedule_obj)
    context = fill_out_acad(context, schedule_obj)

    enrollments = json.loads(schedule_obj.enrollments)
    for idx, enrollment in enumerate(enrollments):
        # form indices start from 1, array indices start from 0
        context = fill_out_course(context, idx + 1, enrollment)

    return context


def fill_out_term(context, schedule_obj):
    if int(schedule_obj.semester.term_code[3]) == 2:
        context['termf'] = 'sp'
    else:
        context['terms'] = 'sp'
    return context


def fill_out_acad(context, schedule_obj):
    end_year = int(schedule_obj.semester.term_code[1:3])
    start_year = end_year - 1
    context['acad'] = unicode(start_year) + '-' + unicode(end_year)
    return context


def get_course_checkbox_val(idx):
    if idx == 1:
        return 'add1'
    elif idx == 2:
        return 'Yes'
    else:
        return 'sp'


def fill_out_course(context, idx, enrollment):
    checkbox_name = 'add' + str(idx)
    course_name = 'crs' + str(idx)
    checkbox_val = get_course_checkbox_val(idx)

    course = Course.objects.get(id=enrollment['course_id'])
    sections = [Section.objects.get(id=section_id)
                for section_id in enrollment['sections']]

    for section in sections:
        meetings = section.meetings.all()

        # TODO: test this
        if section.section_type == Section.TYPE_LECTURE or \
                section.section_type == Section.TYPE_SEMINAR or \
                section.section_type == Section.TYPE_CLASS:
            section_type = 'a'
        elif section.section_type == Section.TYPE_LAB:
            section_type = 'c'
        else:
            section_type = 'b'

        # if there are no days, we assume the class doesn't have meetings
        if len(meetings) > 0 and meetings[0].days:
            daytm_field_name = 'daytm' + str(idx) + section_type
            clsnbr_field_name = 'clsnbr' + str(idx) + section_type

            context[daytm_field_name] = ' '.join([
                meeting.days + meeting.start_time[:-3]
                + " - " + meeting.end_time[:-3] for meeting in meetings
            ])

            context[clsnbr_field_name] = section.section_registrar_id

    context[checkbox_name] = checkbox_val
    context[course_name] = course.primary_listing()
    return context




## CALENDAR EXPORT
from icalendar import Calendar, Event, vCalAddress, vText, vDatetime, vRecur
from datetime import datetime, timedelta
from time import time
from dateutil import parser as dt_parser
import pytz
import re
import uuid

@require_GET
@never_cache
def ical_feed(request, cal_id):
    """
    iCal feed
    Kept up-to-date
    Parameter: cal_id, which is a guid that is 1:1 with schedules in our database
    """
    cal = Calendar()
    cal.add('prodid', '-//Recal Course Planner//recal.io//')
    cal.add('version', '2.0')

    try:
        sched = Schedule.objects.get(Q(ical_uuid=uuid.UUID(cal_id)))
    except Schedule.DoesNotExist:
        return HttpResponseNotFound("Not Found")
    semester = sched.semester

    cal.add('X-WR-CALNAME', 'ReCal %s (%s)' % (unicode(semester), sched.user.netid))
    cal.add('X-WR-CALDESC', sched.title) #'ReCal Schedule'
    cal.add('X-PUBLISHED-TTL', 'PT15M') # https://msdn.microsoft.com/en-us/library/ee178699(v=exchg.80).aspx. 15 minute updates.

    tz = pytz.timezone("US/Eastern") # pytz.utc
    # recurrence
    ical_days = {
        0: 'MO',
        1: 'TU',
        2: 'WE',
        3: 'TH',
        4: 'FR'
    }
    builtin_days = {
        'M': 0,
        'T': 1,
        'W': 2,
        'Th': 3,
        'F': 4
    }

    #data = [hydrate_course_dict(Course.objects.get(Q(id=course['course_id']))) for course in json.loads(sched.enrollments)]

    day_of_week_semester_start = semester.start_date.weekday() # 0-6, monday is 0, sunday is 6. we will have values of 0 (Monday) or 2 (Wednesday)

    for course_obj in json.loads(sched.enrollments):
        #course = Course.objects.get(Q(id=course_obj['course_id'])) # course_obj is json object; course is model
        for section_id in course_obj['sections']:
            section = Section.objects.get(Q(pk=section_id))
            for meeting in section.meetings.all():
                event = Event()
                event.add('summary', unicode(section)) # name of the event
                event.add('location', vText(meeting.location + ', Princeton, NJ'))

                ## compute first meeting date.
                # days when the class meets. convert them to day difference relative to first date of the semester
                daysofweek = [builtin_days[i] for i in meeting.days.split() ] # split by space. format: 0-4. monday is 0, friday is 4. matches python weekday() format.
                if len(daysofweek) == 0:
                    # no meetings -- skip
                    continue
                dayofweek_relative_to_semester_start = []
                for dow in daysofweek:
                    diff = dow - day_of_week_semester_start
                    if diff < 0:
                        diff += 7 # add a week
                    dayofweek_relative_to_semester_start.append(diff)
                assert all([d >= 0 for d in dayofweek_relative_to_semester_start]) # all must be positive
                first_meeting_dayofweek = min(dayofweek_relative_to_semester_start) # a T,Th class will have first meeting on T if semester starts on M, or on Th if semester starts on Wed.

                ## get meeting time
                # meeting.start_time, meeting.end_time examples: "03:20 PM", "10:00 AM"
                start_time = dt_parser.parse(meeting.start_time)
                end_time = dt_parser.parse(meeting.end_time)

                ## add event time.
                event.add('dtstart', tz.localize(datetime(semester.start_date.year, semester.start_date.month , semester.start_date.day , start_time.hour, start_time.minute , 0) + timedelta(days=first_meeting_dayofweek))) #year,month,day, hour,min,second in ET
                event.add('dtend', tz.localize(datetime(semester.start_date.year, semester.start_date.month , semester.start_date.day , end_time.hour, end_time.minute , 0) + timedelta(days=first_meeting_dayofweek)))
                event.add('dtstamp', tz.localize(datetime(semester.start_date.year, semester.start_date.month, semester.start_date.day, 0,0,0))) # "property specifies the DATE-TIME that iCalendar object was created". per 3.8.7.2 of RFC 5545, must be in UTC

                ## recurring event config
                # producing e.g.: RRULE:FREQ=WEEKLY;UNTIL=[LAST DAY OF SEMESTER + 1];WKST=SU;BYDAY=TU,TH
                selected_days = [ical_days[i] for i in sorted(daysofweek) ] # formatted for ical
                end_date = tz.localize(datetime(semester.end_date.year, semester.end_date.month, semester.end_date.day, 0, 0, 0) + timedelta(days=1)) #[LAST DAY OF SEMESTER + 1]
                event.add('rrule', vRecur({'FREQ': 'WEEKLY', 'UNTIL': end_date, 'WKST': 'SU', 'BYDAY': selected_days}))
                cal.add_component(event)

    ical = cal.to_ical()

    # filter out blank lines
    #filtered = filter(lambda x: not re.match(r'^\s*$', x), ical)
    #print filtered
    return HttpResponse(ical, 'text/calendar', status=200)



@login_required
def get_ical_url_for_schedule(request, schedule_id):
    return get_ical_url(request, schedule_id, make_new=False)

@login_required
def regenerate_ical_url_for_schedule(request, schedule_id):
    return get_ical_url(request, schedule_id, make_new=True)

def get_ical_url(request, schedule_id, make_new=False):
    """
    Returns ical feed url for a particular schedule
    Parameter: schedule_id
    We look up the UUID that is 1:1 to this schedule. Each schedule has a UUID always (it is auto-created.)
    If make_new, then we create a new UUID for the schedule.
    Then we return the url with it
    """
    try:
        schedule = Schedule.objects.get(Q(pk=schedule_id))
    except Schedule.DoesNotExist:
        return HttpResponseNotFound("Not Found")
    # Confirm ownership
    if schedule.user.netid != request.user.username:
        return HttpResponseForbidden("Forbidden")

    if make_new:
        schedule.ical_uuid = uuid.uuid4()
        schedule.save()
    return HttpResponse(request.build_absolute_uri(reverse('ical-feed', args=(str(schedule.ical_uuid),))))



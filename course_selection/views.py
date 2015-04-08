from django.utils.dateformat import format
from django.shortcuts import * # render, redirect
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import * # require_GET, etc.
from django.utils import timezone
from django.db.models import Q
from django.views.decorators.cache import cache_page
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import ensure_csrf_cookie # send regardless of whether Django thinks we should

from view_cache_utils import cache_page_with_prefix
from django.template import Template, Context
import hashlib

from datetime import datetime
import json

from models import *

# @ensure_csrf_cookie
def index(request):
    """
    Home page. Show landing page or course selection page, depending on user's state.
    """
    if not request.user.is_authenticated():
        return redirect('landing')

    return render(request, 'index.html', {
        'username': unicode(request.user.username)
    })

@login_required
def course_evaluations(request, semester_id, course_id):
    """
    Course evaluations, an iFrame to registrar's
    """
    return render(request, 'course_evaluations.html', {
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
    meetings = [hydrate_meeting_dict(meeting) for meeting in section.meetings.all()]
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

# TODO: test this function and finish it
def hydrate_course_dict(course):
    sections = [hydrate_section_dict(section, course) for section in course.sections.all()]
    course_listings = [hydrate_course_listing_dict(cl) for cl in course.course_listing_set.all()]
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
    all_courses = Course.objects
    filtered = all_courses.filter(Q(semester__term_code = term_code))
    results = []
    for course in filtered:
        results.append(hydrate_course_dict(course))
    return results

@require_GET
@cache_page(60 * 60 * 24)
def get_courses_json(request, term_code):
    """
    Returns list of courses for a semester
    Cached for a day by ?semester__term_code
    """
    results = get_courses_by_term_code(term_code)
    data = json.dumps(results)
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
    nice_user = Nice_User.objects.get(netid = request.user.username)
    return HttpResponse(request.user.username + " " + unicode(nice_user.id))


#############################################################################
# course enrollment form generation
#############################################################################

# from django.utils.translation import ugettext as _
# from pdf import get_template
#
# def get_worksheet_pdf(request, template_name='course_enrollment_worksheet.pdf', **kwargs):
#     """
#     returns a filled out course enrollment form
#     NOTE: use sp to check a checkbox
#     """
#     user = NetID_Name_Table.objects.get(Q(netid=request.user.username))
#     context = {
#         'class': '2016',
#         'terms': 'sp',
#         'first': unicode(user.first_name),
#         'last': unicode(user.last_name)
#     }
#
#     response = HttpResponse(content_type='application/pdf')
#     response['Content-Disposition'] = \
#         'attachment; filename=course_enrollment_worksheet.pdf'
#
#     template = get_template(template_name)
#     response.write(template.render(context))
#
#     return response

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
from django.views.decorators.clickjacking import xframe_options_exempt
from view_cache_utils import cache_page_with_prefix
import hashlib
from security.views import *

from nice.models import *
from nice import queries

from datetime import datetime
import json

# Views go here.

def gather_dashboard(request):
    """
    Collect information for dashboard page, and return the rendered view.

    This method is called by a few views that point to the dashboard page in different circumstances.
    """
    user = request.user.profile
    page = 0
    if user.ui_state_restoration:
        ui_sr = json.loads(user.ui_state_restoration)
        if 'nav_page' in ui_sr:
            page = ui_sr['nav_page']
    agenda_pref = ['AS', 'RS', 'EX', 'LE', 'LA', 'OH', 'PR']
    if user.ui_agenda_pref:
        agenda_pref = json.loads(user.ui_agenda_pref)
    calendar_pref = ['RS', 'EX', 'LE', 'LA', 'OH', 'PR']
    if user.ui_calendar_pref:
        calendar_pref = json.loads(user.ui_calendar_pref)
    theme = 'w'
    if user.ui_pref:
        theme = json.loads(user.ui_pref)['theme']

    cur_sem = get_cur_semester()

    all_sections = {}
    for section in request.user.profile.sections.all():
        all_sections[section.id] = unicode(section)

    return render(request, "main/index.html", {
        'username': request.user.username, 
        'formatted_name': unicode(request.user.profile),
        'point_count': request.user.profile.get_point_count(),
        'nav_page': page,
        'is_mobile': request.mobile,
        'agenda_pref': agenda_pref,
        'calendar_pref': calendar_pref,
        'cur_sem': {
            'term_code': cur_sem.term_code,
            'start_date': format(cur_sem.start_date, 'U'),
            'end_date': format(cur_sem.end_date, 'U'),
        },
        'theme': theme,
        'base_url': request.build_absolute_uri(),
        'all_sections': json.dumps(all_sections),
        })


def index(request):
    """
    Home page. Show landing page, edit profile page, or dashboard, depending on user's state.
    """
    if not request.user.is_authenticated():
        return redirect('landing')
        #return redirect('cas_login')
    if not user_profile_filled_out(request.user):
        return redirect('edit_profile')
    return gather_dashboard(request)


@xframe_options_exempt # can load in Chrome extension
def chromeframe(request):
    """
    Custom home page for the Chrome extension.

    Shows a custom log in page if the user is not ready to see their dashboard, so that we don't bust out of the New Tab page into a CAS login screen.

    Decorator @xframe_options_exempt is required for this to work in an iframe.
    """
    if not request.user.is_authenticated():
        return redirect('embedded_not_logged_in')
    if not user_profile_filled_out(request.user):
        return redirect('embedded_not_logged_in')
    return gather_dashboard(request)


@xframe_options_exempt
def embedded_not_logged_in(request):
    """
    This is the custom log in page the Chrome Extension home page will show if necessary.
    """
    return render(request, 'embedded/not-logged-in.html', None)

@login_required
def point_award_history(request):
    """
    Fetches point award history, i.e. a log of reputation changes.

    """
    pointChanges = PointChange.objects.filter(user=request.user.profile).order_by('-when').all()
    results = []
    for p in pointChanges:
        reason = filter(lambda x: x[0] == p.relationship, p.REL_CHOICES)[0][1]
        event_title = unicode(p.why)
        results.append(event_title, p.score, reason)
    return HttpResponse(json.dumps(results), 'application/json', status=200) 



def landing(request):
    """
    Displays the landing page.
    """
    if request.user.is_authenticated():
        return redirect('index')
    if request.mobile:
        return render(request, 'landing/mobile.html', None) 
    return render(request, 'landing/index.html', None)

def logout(request):
    """
    Cleans up after the user and logs them out.

    """
    user = request.user.profile
    user.ui_state_restoration = None;
    user.save()
    return redirect('cas_logout')



# Loading Templates
@login_required
def popup(request):
    return render(request, 'main/popup.html', None)

@login_required
def popup_course(request):
    return render(request, 'main/popup-course.html', None)

@login_required
def agenda(request):
    return render(request, 'main/agenda.html', None)

@login_required
def event_picker(request):
    return render(request, 'main/event-picker.html', None)

@login_required
def event_picker_item(request):
    return render(request, 'main/event-picker-item.html', None)

@login_required
def course(request):
    return render(request, 'main/course.html', None)



@login_required
def edit_profile(request):
    '''
    Change which courses you are enrolled in, and edit your name.
    
    '''
    user_profile_filled_out(request.user) # create profile if not already create
    profile = request.user.profile

    cur_sem = get_cur_semester()
    theme = 'w'
    if request.user.profile.ui_pref:
        theme = json.loads(request.user.profile.ui_pref)['theme']
    return render(request, "main/edit-profile-autocomplete.html", {
        'formatted_name': unicode(request.user.profile),
        'cur_sem': {
            'term_code': cur_sem.term_code,
            'start_date': format(cur_sem.start_date, 'U'),
            'end_date': format(cur_sem.end_date, 'U'),
        },
        'is_mobile': request.mobile,
        'user': request.user,
        'theme': theme,
    })

	
@staff_member_required
def tester_login(request):
    '''
    This is for COS 333 tester use only. Lets you log in with a non-CAS account.
    Since each tester only has one netid, they can use this to log in as a second user and test the unapproved content moderation features.
    The tester accounts are: _tester1/tester1 and _tester2/tester2. See fixtures/initial_data.json.

    How this works:
    For debugging purposes, lets you log in as superuser. Run this after creating a superuser through manage.py.
    This just presents the admin login screen rather than CAS.
    Don't forget to visit /logout to logout before using this.
    To generate passwords for the fixtures file, use: http://stackoverflow.com/a/5096323
    '''
    return redirect('/') # Send to home page
    

############################################################
############################################################

### AJAX API Calls ###

@require_ajax
def verify(request):
    """
    Checks whether a user is logged in.
    """
    if request.user.is_authenticated():
        return HttpResponse('1')
    else:
        return HttpResponse('0')

@login_required
@require_GET
@require_ajax
@cache_page_with_prefix(60*60*5, lambda request: hashlib.md5(request.GET.get('term', '')).hexdigest())
def get_classes(request):
    """
    Returns list of classes for an autocomplete query.

    Used on profile (class and section enrollment) page.
    Cached for 5 hours by ?term.
    """
    q = request.GET.get('term', '') # TODO(Maxim, Naphat): switch this to a parameter
    results = queries.search_classes(q)
    data = json.dumps(results) 
    return HttpResponse(data, 'application/json', status=200)

@login_required
@require_POST
@require_ajax
def enroll_sections(request):
    """
    Update user's section enrollment with form data.
    """
    user = request.user.profile
    prev_enrollment = User_Section_Table.objects.filter(user=user)
    prev_enrolled_sections = [enrollment.section for enrollment in prev_enrollment]
    try:
        sections_data = json.loads(request.POST['sections'])
    except:
        return HttpResponse('fail', status=400) # bad request

    for course_id in sections_data:
        for section_id in sections_data[course_id]:
            section = Section.objects.get(id=section_id)
            if section in prev_enrolled_sections:
                prev_enrollment = [enrollment for enrollment in prev_enrollment if enrollment.section != section]
            else:
                enrollment = User_Section_Table(user=user, section=section, add_date=get_current_utc())
                enrollment.save()
                enrollment.color = enrollment.get_usable_color()
                enrollment.save()
    for enrollment in prev_enrollment:
        enrollment.delete()
    
    return HttpResponse('', status=200) # success


@login_required
@require_GET
@require_ajax
def events_json(request, start_date=None, end_date=None, last_updated=None):
    try:
        netid = request.user.username
        if start_date:
            start_date = timezone.make_aware(datetime.fromtimestamp(float(start_date)), timezone.get_default_timezone())
        if end_date:
            end_date = timezone.make_aware(datetime.fromtimestamp(float(end_date)), timezone.get_default_timezone())
        if last_updated:
            last_updated = timezone.make_aware(datetime.fromtimestamp(float(last_updated)), timezone.get_default_timezone())
        events = queries.get_events(netid, start_date=start_date, end_date=end_date, last_updated=last_updated)
        hidden_events = request.user.profile.hidden_events
        if hidden_events:
            hidden_events = json.loads(hidden_events)
        else:
            hidden_events = []
        return HttpResponse(json.dumps({
            'events': events,
            'hidden_events': hidden_events,
        }), content_type='application/javascript')
    except Exception, e:
        raise e
        return HttpResponse(status=500)

@login_required
@require_GET
@require_ajax
def events_by_course_json(request, last_updated=0, start_date=None, end_date=None):
    course_ids = json.loads(request.GET['courseIDs']) # TODO(Maxim, Naphat): switch this to a parameter
    if start_date:
        start_date = timezone.make_aware(datetime.fromtimestamp(float(start_date)), timezone.get_default_timezone())
    if end_date:
        end_date = timezone.make_aware(datetime.fromtimestamp(float(end_date)), timezone.get_default_timezone())
    last_updated = timezone.make_aware(datetime.fromtimestamp(float(last_updated)), timezone.get_default_timezone())
    events = queries.get_events_by_course_ids(course_ids, last_updated=last_updated, start_date=start_date, end_date=end_date)
    return HttpResponse(json.dumps(events), content_type='application/javascript')
    

@login_required
@require_GET
@require_ajax
def sections_json(request):
    netid = request.user.username
    ret = queries.get_sections(netid)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

@login_required
@require_GET
@require_ajax
def default_section_colors_json(request):
    netid = request.user.username
    ret = queries.get_default_colors(netid)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

@login_required
@require_GET
@require_ajax
def section_colors_json(request):
    netid = request.user.username
    ret = queries.get_section_colors(netid)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

@login_required
@require_GET
@require_ajax
def course_json(request, course_id):
    ret = queries.get_course_by_id(course_id)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

@login_required
@require_GET
@require_ajax
def user_json(request):
    user = request.user
    ret = {
        'netid': user.username,
        'name': unicode(user.profile),
        'lastActivityTime': format(user.profile.lastActivityTime, 'U')
    }
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

@login_required
@require_GET
@require_ajax
def unapproved_revisions_json(request, event_id=None):
    unapproved = queries.get_unapproved_revisions(request.user.username)
    return HttpResponse(json.dumps(unapproved), content_type='application/javascript')

@login_required
@require_POST
@require_ajax
def process_votes(request):
    votes = json.loads(request.POST['votes'])
    for vote in votes:
        try:
            queries.process_vote_on_revision(request.user.username, vote['is_positive'], vote['revision_id'])
        except:
            pass # something failed about this vote, so discard it
    return HttpResponse('')

@login_required
@require_POST
@require_ajax
def modify_events(request):
    netid = request.user.username
    ret = ''
    
    if 'events' in request.POST:
        try:
            events = json.loads(request.POST['events'])
            changed, deleted = queries.modify_events(netid, events)
            ret = {
                'changed_ids': changed,
                'deleted_ids': deleted
            }
        except Exception, e:
            print 'Modify events error: ', e
            return HttpResponse('fail', status=500) # 500 Internal Server Error
        
        
    if 'hidden' in request.POST:
        user = request.user.profile
        try:
            hidden = json.loads(request.POST['hidden'])
            hidden = [event_id for event_id in hidden if Event.objects.filter(id=event_id).exists()]
            user.hidden_events = json.dumps(hidden)
            user.save()
        except Exception, e:
            print 'Hide events error: ', e
            return HttpResponse('fail', status=500) # 500 Internal Server Error        
    
    return HttpResponse(json.dumps(ret), content_type='application/javascript', status=201) # 201 Created

@login_required
@require_POST
@require_ajax
def modify_user(request):
    user_dict = json.loads(request.POST['user'])
    user = request.user
    user.first_name = user_dict['first_name']
    user.last_name = user_dict['last_name']
    user.save()
    return HttpResponse(content='1', status=200)

@login_required
@require_GET
@require_ajax
def get_user_point_count(request):
    return HttpResponse(content=request.user.profile.get_point_count(), status=200)

@login_required
@require_POST
@require_ajax
def local_storage_verify(request):
    """Local storage flushing mechanism.

    Once every 10 minutes, you send me a list of all your revision IDs in local storage.

    Then on the server, I loop through the revision IDs array.
    For each, I look up the associated revision, grab its event, compute what I think should be the best revision, and then see if they match.
    If they don't, then I send you back a new event dict with the revision you should actually be showing.

    Returns: dictionary that maps old revision IDs to new event dicts with the proper event details and best revision.
    """
    # TODO(Maxim, Naphat): are we using this, or did we go with /get/0?
    print request.POST
    try:
        revision_ids = json.loads(request.POST['revision_IDs'])
    except:
        return HttpResponse(content="fail", status=500)
    mappings = {}
    for r_id in revision_ids:
        try:
            rev = Event_Revision.objects.get(pk=r_id)
        except:
            continue
        event = rev.event
        best_rev = event.best_revision(netid=request.user.username)
        if best_rev and r_id != best_rev.pk:
            event_dict = queries.construct_event_dict(event, netid=request.user.username, best_rev=best_rev)
            mappings[r_id] = event_dict
    return HttpResponse(json.dumps(mappings), content_type='application/javascript', status=200)


@login_required
@require_GET
@require_ajax
def state_restoration(request):
    netid = request.user.username
    state_restoration = queries.get_state_restoration(netid=netid)
    if state_restoration:
        return HttpResponse(state_restoration, content_type='application/javascript')
    else:
        return HttpResponse('')

@login_required
@require_POST
@require_ajax
def save_state_restoration(request):
    netid = request.user.username
    state_restoration = request.POST['state_restoration']
    return HttpResponse(str(int(queries.save_state_restoration(netid=netid, state_restoration=state_restoration))))


@login_required
@require_POST
@require_ajax
def save_ui_pref(request):
    user = request.user.profile
    user.ui_agenda_pref = request.POST['agenda_pref']
    user.ui_calendar_pref = request.POST['calendar_pref']
    user.ui_pref = request.POST['ui_pref']
    user.save()
    return HttpResponse('')

@login_required
@require_GET
@require_ajax
def all_sections(request):
    all_sections = {}
    for section in request.user.profile.sections.all():
        all_sections[section.id] = unicode(section)
    return HttpResponse(json.dumps(all_sections), content_type='application/javascript')

@login_required
@require_GET
@require_ajax
def all_courses(request):
    all_courses = {}
    for section in request.user.profile.sections.all():
        all_courses[section.course.id] = unicode(section.course)
    return HttpResponse(json.dumps({
            'courses': all_courses,
            'course_sections_map': queries.get_sections(netid=request.user.username),
        }), content_type='application/javascript')

@login_required
@require_GET
@require_ajax
def hidden_events(request):
    netid = request.user.username
    hidden_events = queries.get_hidden_events(netid)
    return HttpResponse(json.dumps(hidden_events), content_type='application/javascript')
    
@login_required
@require_POST
@require_ajax
def similar_events(request):
    netid = request.user.username
    json_dict = request.POST['event_dict']
    ed = queries.parse_json_event_dict(json_dict)
    results = queries.get_similar_events(ed) # these are revisions
    event_dicts = [queries.construct_event_dict(r.event) for r in results]
    filtered_edicts = [fed for fed in event_dicts if fed is not None] # will have None for events without any approved revisions
    return HttpResponse(json.dumps(filtered_edicts), content_type='application/javascript')
    

############################################################
############################################################

### Helper Methods ###

def user_profile_filled_out(user):
    '''
    Checks for whether the user profile has been filled out.
    '''
    try:
        profile = user.profile # throws DoesNotExist here if profile has not been created yet
        return profile.sections.count() > 0 # check that it's filled, i.e. that there are some sections selected.
    except User_Profile.DoesNotExist:
        profile = User_Profile.objects.create(user=user, lastActivityTime=get_current_utc())
        return False # just created, but not filled out yet
        


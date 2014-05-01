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

from nice.models import *
from nice.forms import * 
from nice import queries
from datetime import datetime

from django.views.decorators.clickjacking import xframe_options_exempt

import json

# Views go here.

'''
A good way to find out fields a model has: return HttpResponse(repr(request.user._meta.get_all_field_names()))

To restrict a method to staff members only, decorate with @staff_member_required
Alternatives: @user_passes_test(lambda u: u.is_staff) or @permission_required('is_superuser')
'''

@xframe_options_exempt # can load in Chrome extension
def index(request):
    if not request.user.is_authenticated():
        return redirect('cas_login')
    if not user_profile_filled_out(request.user):
        return redirect('edit_profile')
    user = request.user.profile
    page = 1
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

    return render(request, "main/index.html", {
        'username': request.user.username, 
        'formatted_name': unicode(request.user.profile),
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
        })
    response.set_cookie('netid', request.user.username)
    return response

def landing(request):
    return render(request, 'landing/index.html', None)

def logout(request):
    user = request.user.profile
    user.ui_state_restoration = None;
    user.save()
    return redirect('cas_logout')

# loading templates
def popup(request):
    return render(request, 'main/popup.html', None)
def popup_course(request):
    return render(request, 'main/popup-course.html', None)
def agenda(request):
    return render(request, 'main/agenda.html', None)
def event_picker(request):
    return render(request, 'main/event-picker.html', None)
def event_picker_item(request):
    return render(request, 'main/event-picker-item.html', None)
def course(request):
    return render(request, 'main/course.html', None)

@login_required
def edit_profile_manual(request):
    '''
    Change which courses you are enrolled in, and edit your name.
    '''
    user_profile_filled_out(request.user) # create profile if not already create
    profile = request.user.profile

    # Compile list of options
    enrolled = [s.course for s in profile.sections.all()]
    not_enrolled = [c for c in Course.objects.all() if c not in enrolled]
    all = [(c.id, str(c), True) for c in enrolled] # course ID, course title, and whether enrolled already
    all.extend([(c.id, str(c), False) for c in not_enrolled])

    form = EnrollCoursesForm(request.POST or None, extra=all, initial_first = request.user.first_name, initial_last = request.user.last_name)
    if form.is_valid(): # runs validation and confirms that there are no validation errors
        # Process Register Courses form.
        chosen_courses = list(form.extra_courses())
        for c in chosen_courses:
            if c not in all: # This version is different from the previous states of the records (found in all)
                # Course enrollment change.
                the_course = Course.objects.get(pk=c[0])
                if c[2] == True:
                    # Enroll user in course, i.e. add to default "All Students" section(s)
                    for default_section in the_course.section_set.filter(isDefault=True):
                        user_in_section = User_Section_Table(user = profile, section=default_section, add_date = get_current_utc())
                        user_in_section.save()
                        user_in_section.color = user_in_section.get_usable_color()
                        user_in_section.save()
                else:
                    # Remove user from class, i.e. remove from all sections matching this course ID
                    User_Section_Table.objects.filter(section__course_id=the_course.id).filter(user=profile).delete()
        
        # Process name fields.
        request.user.first_name = form.cleaned_data['first_name']
        request.user.last_name = form.cleaned_data['last_name']
        request.user.save()
        
        # Done processing, redirect to edit-sections form.
        return redirect('nice.views.edit_sections')
    
    return render(request, "main/edit-profile.html", {'courses_form':form, 'formatted_name': unicode(profile)})
    

@login_required
def edit_profile(request):
    '''
    Change which courses you are enrolled in, and edit your name.
    TODO: enable name editing.
    '''
    user_profile_filled_out(request.user) # create profile if not already create
    profile = request.user.profile

    cur_sem = get_cur_semester()
    return render(request, "main/edit-profile-autocomplete.html", {
        'formatted_name': unicode(request.user.profile),
        'cur_sem': {
            'term_code': cur_sem.term_code,
            'start_date': format(cur_sem.start_date, 'U'),
            'end_date': format(cur_sem.end_date, 'U'),
        },
        'is_mobile': request.mobile,
        'user': request.user,
    })

@login_required
def enroll_sections(request):
    user = request.user.profile
    prev_enrollment = User_Section_Table.objects.filter(user=user)
    prev_enrolled_sections = [enrollment.section for enrollment in prev_enrollment]
    sections_data = json.loads(request.POST['sections'])
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
    return HttpResponse('')

    
@login_required
def get_classes(request):
    """
    Returns list of classes for an autocomplete query. Used on profile (class and section enrollment) page.

    TODO(Maxim): cache by ?term.
    """
    if request.is_ajax():
        q = request.GET.get('term', '') # autocomplete query
        results = queries.search_classes(q)
        data = json.dumps(results) 
        status = 200 # OK
    else:
        data = 'fail'
        status = 400 # Bad Request (need to use AJAX)
    return HttpResponse(data, 'application/json', status=status)

    
@login_required
def edit_sections(request):
    '''
    For the courses you're enrolled in, choose sections (precepts, labs, etc.) to join.
    '''
    # If no profile created yet, or no sections chosen, then redirect to choose courses page.
    if not user_profile_filled_out(request.user):
        return redirect('nice.views.edit_profile')
    profile = request.user.profile

    # Compile list of options
    my_current_sections = profile.sections.all()
    enrolled_classes = set([s.course for s in my_current_sections]) # convert to set to remove duplicates
    
    class_list = []
    
    for c in enrolled_classes: # for each class the user is enrolled in
        all_sections = c.section_set.exclude(isDefault=True) # all sections other than the default All Students section
        seclist = [(s.id, str(s), True) for s in all_sections if s in my_current_sections] # section ID, course title, section name, and whether enrolled already
        seclist.extend([(s.id, str(s), False) for s in all_sections if s not in my_current_sections])
        class_obj = (c.id, str(c), seclist) # class ID, class title, sections list
        class_list.append(class_obj)
    
    form = ChooseSectionsForm(request.POST or None, extra=class_list)
    if form.is_valid(): # runs validation and confirms that there are no validation errors
        # Process Choose Sections form.
        chosen_sections = list(form.extra_sections())
        for s_id, c_id, enrolled in chosen_sections:
            s = Section.objects.get(pk=s_id)
            if not s:
                continue
            if enrolled and s not in my_current_sections: # This section has been changed to enrolled status
                # Enrolling in new section.
                user_in_section = User_Section_Table(user = profile, section=s, add_date = get_current_utc())
                user_in_section.color = user_in_section.get_usable_color()
                user_in_section.save()
            elif not enrolled and s in my_current_sections and not s.isDefault: # This section has been changed to not-enrolled status (and isn't a default section, i.e. enrollment isn't mandatory)
                # Unenrolling in a section
                User_Section_Table.objects.get(section_id=s_id, user=profile).delete()
        
        # Done processing, redirect to dashboard.
        return redirect("/")
    
    return render(request, "main/edit-sections.html", {'sections_form':form, 'formatted_name': unicode(profile)})
    
	
@staff_member_required # this is why this works
def login_admin(request):
    '''
    For debugging purposes, log in as superuser. Run this after creating a superuser through manage.py.
    This just presents the admin login screen rather than CAS.
    Don't forget to visit /logout to logout before using this.
    '''
    return redirect('/admin/') # send to admin panel once the staff member has logged in
    
# for AJAX
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
        #return render(request, 'main/event-json-test.html')
    except Exception, e:
        print e

def events_by_course_json(request, last_updated=0, start_date=None, end_date=None):
    course_ids = json.loads(request.GET['courseIDs'])
    if start_date:
        start_date = timezone.make_aware(datetime.fromtimestamp(float(start_date)), timezone.get_default_timezone())
    if end_date:
        end_date = timezone.make_aware(datetime.fromtimestamp(float(end_date)), timezone.get_default_timezone())
    last_updated = timezone.make_aware(datetime.fromtimestamp(float(last_updated)), timezone.get_default_timezone())
    events = queries.get_events_by_course_ids(course_ids, last_updated=last_updated, start_date=start_date, end_date=end_date)
    return HttpResponse(json.dumps(events), content_type='application/javascript')
    

def sections_json(request):
    netid = request.user.username
    ret = queries.get_sections(netid)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

def default_section_colors_json(request):
    netid = request.user.username
    ret = queries.get_default_colors(netid)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

def section_colors_json(request):
    netid = request.user.username
    ret = queries.get_section_colors(netid)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

def course_json(request, course_id):
    ret = queries.get_course_by_id(course_id)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

def unapproved_revisions_json(request, event_id=None):
    unapproved = queries.get_unapproved_revisions(request.user.username)
    return HttpResponse(json.dumps(unapproved), content_type='application/javascript')

def process_votes(request):
    votes = json.loads(request.POST['votes'])
    for vote in votes:
        queries.process_vote_on_revision(request.user.username, votes['is_positive'], votes['revision_id'])
    return HttpResponse('')

@login_required
@require_POST
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
            print 'Modifying events error: ', e
            return HttpResponse(status=500) # 500 Internal Server Error
        
        
    if 'hidden' in request.POST:
        user = request.user.profile
        hidden = json.loads(request.POST['hidden'])
        hidden = [event_id for event_id in hidden if Event.objects.filter(id=event_id).exists()]
        user.hidden_events = json.dumps(hidden)
        user.save()
        """try:
            to_hide = json.loads(request.POST['hide'])
            queries.hide_events(netid, to_hide)
        except Exception, e:
            print 'Modifying events error 2: ', e
            return HttpResponse(status=500) # 500 Internal Server Error
        """
        
    return HttpResponse(json.dumps(ret), content_type='application/javascript', status=201) # 201 Created

@login_required
def modify_user(request):
    user_dict = json.loads(request.POST['user'])
    user = request.user
    user.first_name = user_dict['first_name']
    user.last_name = user_dict['last_name']
    user.save()
    return HttpResponse('')

def state_restoration(request):
    netid = request.user.username
    state_restoration = queries.get_state_restoration(netid=netid)
    if state_restoration:
        return HttpResponse(state_restoration, content_type='application/javascript')
    else:
        return HttpResponse('')

def save_state_restoration(request):
    netid = request.user.username
    state_restoration = request.POST['state_restoration']
    return HttpResponse(str(int(queries.save_state_restoration(netid=netid, state_restoration=state_restoration))))
def save_ui_pref(request):
    user = request.user.profile
    user.ui_agenda_pref = request.POST['agenda_pref']
    user.ui_calendar_pref = request.POST['calendar_pref']
    user.ui_pref = request.POST['ui_pref']
    user.save()
    return HttpResponse('')

def all_sections(request):
    all_sections = {}
    for section in request.user.profile.sections.all():
        all_sections[section.id] = unicode(section)
    return HttpResponse(json.dumps(all_sections), content_type='application/javascript')

def hidden_events(request):
    netid = request.user.username
    hidden_events = queries.get_hidden_events(netid)
    return HttpResponse(json.dumps(hidden_events), content_type='application/javascript')
    
@require_POST
def similar_events(request):
    netid = request.user.username
    json_dict = request.POST['event_dict']
    ed = queries.parse_json_event_dict(json_dict)
    results = queries.get_similar_events(ed) # these are revisions
    event_dicts = [queries.construct_event_dict(r.event) for r in results]
    filtered_edicts = [fed for fed in event_dicts if fed is not None] # will have None for events without any approved revisions
    return HttpResponse(json.dumps(filtered_edicts), content_type='application/javascript')
    

# Helper methods
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
        
        

        
        
        
# test
def contact_us(req):
    if req.method == 'POST':
        form = ContactForm(req.POST) # bind the form to the passed-in data dict
        if form.is_valid(): # this runs all validation and cleaning methods
            # No validation errors.
            print 'succeeded form' # or read from form.cleaned_data
            pass # should redirect somewhere upon success
    else:
        form = ContactForm() # no associated data, so don't validate
    return render(req, "main/test-form-verbose.html", {'form':form}) # or main/test-form.html

def form_test_two(request):
    #sections = range(1,6) # our "sections"
    sections = (('1', 'Option 1'),('2', 'Option 2'),('3', 'Option 3'),)
    form = AnotherFormExample(request.POST or None, extra=sections)
    form.fields['max_number'].choices = [(1,1),(2,2),(3,3)]
    form.fields['max_number'].initial = [3]
    if form.is_valid():
        # No validation errors.
        print 'succeeded form' 
        # use form.cleaned_data
        return redirect("/")

from django.shortcuts import * # render, redirect
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import * # require_GET, etc.
from django.utils import timezone

from nice.models import *
from nice.forms import *
from nice import queries
from datetime import datetime

import json

# Views go here.

'''
A good way to find out fields a model has: return HttpResponse(repr(request.user._meta.get_all_field_names()))

To restrict a method to staff members only, decorate with @staff_member_required
Alternatives: @user_passes_test(lambda u: u.is_staff) or @permission_required('is_superuser')
'''

def index(request):
    if not request.user.is_authenticated():
        return redirect('cas_login')
    if not user_profile_filled_out(request.user):
        return redirect('edit_profile')
    return render_to_response('main/index.html', {
        'username': request.user.username,
    }, context_instance=RequestContext(request));
    

# loading templates

def popup(request):
    return render(request, 'main/popup.html', None)
def agenda(request):
    return render(request, 'main/agenda.html', None)
def typepicker(request):
    return render(request, 'main/type-picker.html', None)

@login_required
def edit_profile(request):
    '''
    Change which courses you are enrolled in.
    TODO: add options to change your name and which sections you're in.
    '''
    user_profile_filled_out(request.user) # create profile if not already create
    profile = request.user.profile

    # Compile list of options
    enrolled = [s.course for s in profile.sections.all()]
    not_enrolled = [c for c in Course.objects.all() if c not in enrolled]
    all = [(c.id, str(c), True) for c in enrolled] # course ID, course title, and whether enrolled already
    all.extend([(c.id, str(c), False) for c in not_enrolled])

    form = EnrollCoursesForm(request.POST or None, extra=all)
    if form.is_valid():
        # No validation errors.
        print 'Processing Choose Sections form.' 
        chosen_courses = list(form.extra_courses())
        for c in chosen_courses:
            if c not in all: # This version is different from the previous states of the records (found in all)
                print 'Course enrollment change.'
                the_course = Course.objects.get(pk=c[0])
                if c[2] == True:
                    # Enroll user in course, i.e. add to default "All Students" section(s)
                    for default_section in the_course.section_set.filter(isDefault=True):
                        user_in_section = User_Section_Table(user = profile, section=default_section, add_date = get_current_utc())
                        user_in_section.save()
                else:
                    # Remove user from class, i.e. remove from all sections matching this course ID
                    User_Section_Table.objects.filter(section__course_id=the_course.id).filter(user=profile).delete()
        # Done processing, redirect to dashboard.
        print 'Redirecting from profile page.'
        return redirect("/")
    
    return render(request, "main/edit-profile.html", {'courses_form':form, 'netid': request.user.username})
	
@staff_member_required # this is why this works
def login_admin(request):
    '''
    For debugging purposes, log in as superuser. Run this after creating a superuser through manage.py.
    This just presents the admin login screen rather than CAS.
    Don't forget to visit /logout to logout before using this.
    '''
    return redirect('/admin/') # send to admin panel once the staff member has logged in
    
@staff_member_required 
def seed_data(request):
    seed_db_with_data()
    return HttpResponse("Data added.")
    
@staff_member_required 
def delete_data(request):
    clear_all_data()
    return HttpResponse("Data removed.")
	

# for AJAX
def events_json(request, start_date=None, end_date=None, last_updated=None):
    netid = request.user.username
    if start_date:
        start_date = timezone.make_aware(datetime.fromtimestamp(float(start_date)), timezone.get_default_timezone())
    if end_date:
        end_date = timezone.make_aware(datetime.fromtimestamp(float(end_date)), timezone.get_default_timezone())
    if last_updated:
        last_updated = timezone.make_aware(datetime.fromtimestamp(float(last_updated)), timezone.get_default_timezone())
    events = queries.get_events(netid, start_date=start_date, end_date=end_date)
    return HttpResponse(json.dumps(events), content_type='application/javascript')

def modify_events(request):
    netid = request.user.username
    events = json.loads(request.POST['events'])
    ret = queries.modify_events(netid, events)
    return HttpResponse(json.dumps(ret), content_type='application/javascript')

def state_restoration(request):
    netid = request.user.username
    # TODO what to return when null?
    state_restoration = queries.get_state_restoration(netid=netid)
    if state_restoration:
        return HttpResponse(state_restoration, content_type='application/javascript')
    else:
        return HttpResponse('')

def save_state_restoration(request):
    netid = request.user.username
    state_restoration = request.POST['state_restoration']
    return HttpResponse(str(int(queries.save_state_restoration(netid=netid, state_restoration=state_restoration))))
    
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
        

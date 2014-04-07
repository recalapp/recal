from django.shortcuts import * # render, redirect
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.utils import timezone

from nice.models import *
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
    return render(request, 'main/index.html', None)
    

# loading templates

def popup(request):
    return render(request, 'main/popup.html', None)
def agenda(request):
    return render(request, 'main/agenda.html', None)
def typepicker(request):
    return render(request, 'main/type-picker.html', None)

@login_required
@require_GET
def edit_profile(request):
    user_profile_filled_out(request.user) # create profile if not already create
    profile = request.user.profile
    return HttpResponse(str(profile)) # TODO: return name and sections you're enrolled in.

@require_POST
def make_profile_changes(request):
    pass
	
@require_GET
def cas_bypass(request):
    '''
    For debugging purposes, log in as superuser. Run this after creating a superuser through manage.py.
    '''
    from django.contrib.auth import authenticate, login, logout
    logout(request) # log out of current user
    user = authenticate(username='su', password='su_password') # log in with superuser account
    if user is not None:
        login(request, user)
        return HttpResponse("logged in as superuser, now you can go to /admin")
    return HttpResponse("user not found -- did you give the right superuser credentials?")
    
@staff_member_required 
def seed_data(request):
    seed_db_with_data()
    return HttpResponse("Data added.")
	
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
        
# for AJAX
def events_json(request, netid, start_date=None, end_date=None):
    if start_date:
        start_date = timezone.make_aware(datetime.fromtimestamp(float(start_date)), timezone.get_default_timezone())
    if end_date:
        end_date = timezone.make_aware(datetime.fromtimestamp(float(end_date)), timezone.get_default_timezone())
    events = queries.get_events(netid, start_date, end_date)
    return HttpResponse(json.dumps(events), mimetype='application/javascript')

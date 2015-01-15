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
from django.views.decorators.csrf import ensure_csrf_cookie # send regardless of whether Django thinks we should
from view_cache_utils import cache_page_with_prefix
from django.template import Template, Context
import hashlib

from datetime import datetime
import json

from models import *

@login_required
def index(request):
    return render(request, 'index.html', {
        'username': unicode(request.user.username)    
    })

def hydrate_meeting_dict(meeting):
    return {
        'days': meeting.days,
        'start_time': meeting.start_time,
        'end_time': meeting.end_time,
        'location': meeting.location
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
        'title': course.title,
        'sections': sections,
        'semester': unicode(course.semester),
    }

def get_courses_by_term_code(term_code):
    all_courses = Course.objects
    filtered = all_courses.filter(Q(semester__term_code = term_code))
    results = []
    for course in filtered:
        results.append(hydrate_course_dict(course))
    return results

@login_required
@require_GET
@cache_page_with_prefix(60 * 60, lambda request: hashlib.md5(request.GET.get('semester__term_code', '')).hexdigest())
def get_courses_json(request):
    """
    Returns list of courses for a semester
    Cached for 1 minute by ?semester__term_code
    """
    term_code = request.GET.get('semester__term_code', '')
    results = get_courses_by_term_code(term_code)
    data = json.dumps(results)
    return HttpResponse(data, 'application/json', status=200)


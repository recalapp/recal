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

# TODO: test this function and finish it
def construct_course_dict(course):
    return {
        'id': course.id,
        'description': course.description,
        'title': course.title,
        'semester': unicode(course.semester),
    }

def get_courses_by_term_code(term_code):
    all_courses = Course.objects
    filtered = all_courses.filter(Q(semester__term_code = term_code))
    results = []
    for course in filtered:
        results.append(construct_course_dict(course))
    return results

@login_required
@require_GET
def get_courses_json(request):
    """
    Returns list of courses for a semester
    """
    term_code = request.GET.get('semester__term_code', '')
    results = get_courses_by_term_code(term_code)
    data = json.dumps(results)
    return HttpResponse(data, 'application/json', status=200)

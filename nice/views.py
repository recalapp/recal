from django.shortcuts import * # render, redirect
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.utils import timezone

from nice.models import *
from nice import queries
from datetime import datetime

import json

# Views go here.

def index(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(reverse('cas_login'))
    return render(request, 'main/index.html', None)

# loading templates

def popup(request):
    return render(request, 'main/popup.html', None)
def agenda(request):
    return render(request, 'main/agenda.html', None)
def typepicker(request):
    return render(request, 'main/type-picker.html', None)

# for AJAX
def events_json(request, netid, start_date=None, end_date=None):
    if start_date:
        start_date = timezone.make_aware(datetime.fromtimestamp(float(start_date)), timezone.get_default_timezone())
    if end_date:
        end_date = timezone.make_aware(datetime.fromtimestamp(float(end_date)), timezone.get_default_timezone())
    events = queries.get_events(netid, start_date, end_date)
    return HttpResponse(json.dumps(events), mimetype='application/javascript')

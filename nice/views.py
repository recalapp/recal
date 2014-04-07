from django.shortcuts import * # render, redirect
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

from nice.models import *
from nice import queries

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
def events_json(request, netid):
    events = queries.get_events(netid)
    return HttpResponse(json.dumps(events), mimetype='application/javascript')

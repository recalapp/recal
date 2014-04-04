from django.shortcuts import * # render, redirect
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

from nice.models import *

# Views go here.

def index(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(reverse('cas_login'))
    return render(request, 'main/index.html', None)

def popup(request):
    return render(request, 'main/popup.html', None);
def agenda(request):
    return render(request, 'main/agenda.html', None);
	
def testview(request):
    return HttpResponse("Hello")

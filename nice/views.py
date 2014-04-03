from django.shortcuts import * # render, redirect
from django.http import * # HttpResponse

from nice.models import *

# Views go here.

def index(request):
    return render(request, 'main/index.html', None)

def popup(request):
    return render(request, 'main/popup.html', None);
def agenda(request):
    return render(request, 'main/agenda.html', None);
	
def testview(request):
    return HttpResponse("Hello")

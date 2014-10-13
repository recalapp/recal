from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

from course_selection import views

urlpatterns = patterns(
    "",
    url(r'^$', views.index, name="course_selection")
)

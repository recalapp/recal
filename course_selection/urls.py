from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin

from tastypie.api import Api
from course_selection.api import *
from course_selection import views

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(CourseResource())
v1_api.register(SemesterResource())

urlpatterns = patterns(
    "",
    url(r'^$', views.index, name="course_selection"),
    url(r'^api/', include(v1_api.urls)),
)

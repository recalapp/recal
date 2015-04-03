from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin

from tastypie.api import Api
from course_selection.api import *
from course_selection import views

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(ColorPaletteResource())
v1_api.register(CourseResource())
v1_api.register(ScheduleResource())
v1_api.register(SemesterResource())
v1_api.register(UserResource())
v1_api.register(ProfessorResource())
v1_api.register(CourseListingResource())
#v1_api.register(MeetingResource())
#v1_api.register(SectionResource())

urlpatterns = patterns(
    "",
    url(r'^$', views.index, name="course_selection"),
    url(r'^course_evaluations/(?P<semester_id>\d+)/(?P<course_id>\d+)$', views.course_evaluations, name="course_evaluations"),
    url(r'^api/', include(v1_api.urls)),
    url(r'^api/static/courses/(?P<term_code>\d+)$', views.get_courses_json, name='get-courses-json'),
    url(r'^mobile_logged_in$', views.mobile_logged_in, name='mobile_logged_in'),
    url(r'^landing$', views.landing, name="landing"),

    #url(r'^api/static/worksheet', views.get_worksheet_pdf, name='get-workseet-pdf'),
)

from django.conf.urls import patterns, include, url
from django.contrib import admin

from tastypie.api import Api
# TODO remove import *
from course_selection.api import *  # NOQA
from course_selection import views

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(ColorPaletteResource())
v1_api.register(CourseResource())
v1_api.register(ScheduleResource())
v1_api.register(SemesterResource())
v1_api.register(UserResource())
v1_api.register(FriendRequestResource())
v1_api.register(ProfessorResource())
v1_api.register(CourseListingResource())
# v1_api.register(MeetingResource())
# v1_api.register(SectionResource())
# TODO: figure out how to add v2 apis

urlpatterns = patterns(
    "",
    url(r'^$', views.index, name="course_selection"),
    url(r'^checks/continuity$', views.continuity_check, name="checks_continuity"),
    url(r'^course_evaluations/(?P<semester_id>\d+)/(?P<course_id>\d+)$',
        views.course_evaluations, name="course_evaluations"),
    url(r'^api/', include(v1_api.urls)),
    url(r'^api/static/courses/(?P<term_code>\d+)$',
        views.get_courses_json, name='get-courses-json'),
    url(r'^api/static/courses', views.get_courses_json_old,
        name='get-courses-json-old'),
    url(r'^api/static/users', views.get_users_json, name='get-users-json'),

    url(r'^mobile_logged_in$', views.mobile_logged_in, name='mobile_logged_in'),
    url(r'^landing$', views.landing, name="landing"),
    url(r'^status$', views.status, name="status"),
    url(r'^about$', views.about, name="about"),

    #url(r'^announcements/sorry$', views.we_sorry, name="sorry"),

    url(r'^api/worksheet/(?P<schedule_id>\d+)$',
        views.get_worksheet_pdf, name='get-worksheet-pdf'),
)

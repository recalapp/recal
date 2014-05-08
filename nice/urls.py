from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

import nice, cas
from nice import views
urlpatterns = patterns('',
    url(r'^login/$', cas.views.login, name='cas_login'),
    url(r'^logout/$', cas.views.logout, name='cas_logout'),
    url(r'^verify$', views.verify, name='verify'),
    url(r'^user-logout$', views.logout, name='user_logout'),
    url(r'^grappelli/', include('grappelli.urls')), # grappelli URLS
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name="index"),
    url(r'^chromeframe/$', views.chromeframe, name="chrome_frame"),
    url(r'^chromeframe/loggedout$', views.embedded_not_logged_in, name="embedded_not_logged_in"),
    url(r'^get/(?P<last_updated>\d+)/(?P<start_date>\d+)/(?P<end_date>\d+)$', views.events_json, name='events-json'),
    url(r'^get/(?P<last_updated>\d+)/(?P<start_date>\d+)$', views.events_json, name='events-json'),
    url(r'^get/(?P<last_updated>\d+)$', views.events_json, name='events-json'),
    url(r'^get/state-restoration$', views.state_restoration, name='state-restoration'),
    url(r'^get/similar-events$', views.similar_events, name='similar_event'),
    url(r'^get/sections', views.sections_json, name='sections-json'),
    url(r'^get/section-colors', views.section_colors_json, name='section-colors-json'),
    url(r'^get/default-section-colors', views.default_section_colors_json, name='section-colors-json'),
    url(r'^get/course/(?P<course_id>\d+)$', views.course_json, name='course-json'),
    url(r'^get/bycourses/(?P<last_updated>\d*)$', views.events_by_course_json, name='events-by-course'),
    url(r'^get/bycourses/(?P<last_updated>\d+)/(?P<start_date>\d+)/(?P<end_date>\d+)$', views.events_by_course_json, name='events-by-course'),
    url(r'^get/user$', views.user_json, name='user-json'),
    url(r'^get/unapproved$', views.unapproved_revisions_json, name='unapproved-revisions'),
    url(r'^get$', views.events_json, name='events-json'),
    url(r'^put/state-restoration$', views.save_state_restoration, name='save-state-restoration'),
    url(r'^put$', views.modify_events, name='modify_events'),
    url(r'^put/sections$', views.enroll_sections, name='enroll-sections'),
    url(r'^put/ui-pref$', views.save_ui_pref, name='save-ui-pref'),
    url(r'^put/user$', views.modify_user, name="modify-user"),
    url(r'^put/votes$', views.process_votes, name='process-votes'),
    url(r'^popup-template$', views.popup, name="popup"),
    url(r'^popup-course-template$', views.popup_course, name="popup-course"),
    url(r'^agenda-template$', views.agenda, name="agenda"),
    url(r'^course-template$', views.course, name="course"),
    url(r'^api/classlist', views.get_classes, name="ajax_class_list"),
    url(r'^api/point_history', views.point_award_history, name="point_award_history"),
    url(r'^api/point_count', views.get_user_point_count, name="point_count"),
    url(r'^api/localstorage/verify', views.local_storage_verify, name="local_storage_verify"),
    url(r'^profile$', views.edit_profile, name="edit_profile"),
    url(r'^debug/profile_old', views.edit_profile_manual, name="edit_profile_manual"),
    url(r'^sections', views.edit_sections, name="edit_sections"),
    url(r'^event-picker$', views.event_picker, name="event-picker"),
    url(r'^event-picker-item$', views.event_picker_item, name="event-picker-item"),
    url(r'^all-sections$', views.all_sections, name='all-sections'),
    url(r'^all-courses', views.all_courses, name='all-courses'),
    url(r'^hidden_events$', views.hidden_events, name='hidden-events'), # NOTE: will be used later when we want to give the users a toggle
    # a few debug tricks
    url(r'^debug/su_login$', views.login_admin, name="login_admin"),
    url(r'^testform$', views.contact_us, name="test_form"),
    url(r'^testform2$', views.form_test_two, name="test_form2"),
    url(r'^landing$', views.landing, name="landing"),
)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns('',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )

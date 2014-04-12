from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

import nice, cas
from nice import views

urlpatterns = patterns('',
    url(r'^login/$', cas.views.login, name='cas_login'),
    url(r'^logout/$', cas.views.logout, name='cas_logout'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name="index"),
    url(r'^get/(?P<last_updated>\d+)/(?P<start_date>\d+)/(?P<end_date>\d+)$', views.events_json, name='events-json'),
    url(r'^get/(?P<last_updated>\d+)/(?P<start_date>\d+)$', views.events_json, name='events-json'),
    url(r'^get/(?P<last_updated>\d+)$', views.events_json, name='events-json'),
    url(r'^get/state-restoration$', views.state_restoration, name='state-restoration'),
    url(r'^get$', views.events_json, name='events-json'),
    url(r'^put/state-restoration$', views.save_state_restoration, name='save-state-restoration'),
    url(r'^put$', views.modify_events, name='modify_events'),
    url(r'^hide$', views.hide_event, name='hide_event'),
    url(r'^popup-template$', views.popup, name="popup"),
    url(r'^agenda-template$', views.agenda, name="agenda"),
    url(r'^profile', views.edit_profile, name="edit_profile"),
    url(r'^type-picker$', views.typepicker, name="type-picker"),
    url(r'^section-picker$', views.sectionpicker, name="section-picker"),
    url(r'^all-sections$', views.all_sections, name='all-sections'),
    url(r'^hidden_events$', views.hidden_events, name='hidden-events'), # NOTE: will be used later when we want to give the users a toggle
    # a few debug tricks
    url(r'^debug/su_login$', views.login_admin, name="login_admin"),
    url(r'^debug/seed_data$', views.seed_data, name="seed_data"),
    url(r'^debug/delete_data$', views.delete_data, name="delete_data"),
    url(r'^testform$', views.contact_us, name="test_form"),
    url(r'^testform2$', views.form_test_two, name="test_form2"),
)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns('',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )

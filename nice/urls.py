from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

import nice, cas
from nice import views

urlpatterns = patterns('',
    url(r'^login/$', cas.views.login, name='cas_login'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name="index"),
    url(r'^(?P<netid>\S+)$', views.events_json, name='events-json'),
    url(r'^popup-template$', views.popup, name="popup"),
    url(r'^agenda-template$', views.agenda, name="agenda"),
    url(r'^type-picker$', views.typepicker, name="type-picker")
)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns('',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )

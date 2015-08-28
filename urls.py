from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

import cas

urlpatterns = patterns(
    "",
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^grappelli/', include('grappelli.urls')),  # grappelli URLS
    url(r'^admin/', include(admin.site.urls)),
    url(r'^course_selection/', include('course_selection.urls')),
    url(r'^hackerino/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'admin/login.html'}),
    url(r'^hackerino/logout/$', 'django.contrib.auth.views.logout',
        {'template_name': 'admin/logout.html'}),
    url(r'^', include('course_selection.urls')),
)

urlpatterns += patterns(
    'cas.views',
    url(r'^login/$', 'login', name='cas_login'),
    url(r'^logout/$', 'logout', name='cas_logout'),
)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)

"""
Debug toolbar url

"""
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns('',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )

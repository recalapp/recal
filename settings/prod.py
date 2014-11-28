from common import *
from os import environ

########## DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
#DEBUG = bool(environ.get('DJANGO_DEBUG', ''))
DEBUG = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
TEMPLATE_DEBUG = DEBUG
# ########## END DEBUG CONFIGURATION

########## DATABASE CONFIGURATION
# Parse database configuration from $DATABASE_URL
import dj_database_url
DATABASES['default'] =  dj_database_url.config()

########## END DATABASE CONFIGURATION

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Limit Host and Referrer headers for security purposes
# See https://docs.djangoproject.com/en/1.6/ref/settings/#std:setting-ALLOWED_HOSTS
ALLOWED_HOSTS = [
    '.recal.io', # Allow domain and subdomains
    '.recal.io.', # Also allow FQDN and subdomains
]

SECRET_KEY = environ.get('DJANGO_SECRET_KEY', '')

os.environ['MEMCACHE_SERVERS'] = os.environ['MEMCACHIER_SERVERS'].replace(',', ';')
os.environ['MEMCACHE_USERNAME'] = os.environ['MEMCACHIER_USERNAME']
os.environ['MEMCACHE_PASSWORD'] = os.environ['MEMCACHIER_PASSWORD']

CACHES = {
    'default': {
        'BACKEND': 'django_pylibmc.memcached.PyLibMCCache',
        'TIMEOUT': 500,
        'BINARY': True,
        'OPTIONS': { 'tcp_nodelay': True }
    }
}

########## TOOLBAR CONFIGURATION
# See: https://github.com/django-debug-toolbar/django-debug-toolbar#installation
INSTALLED_APPS += (
    #'debug_toolbar',
)

# See: https://github.com/django-debug-toolbar/django-debug-toolbar#installation
#INTERNAL_IPS = ('127.0.0.1',)
#
#DEBUG_TOOLBAR_PATCH_SETTINGS = False

### TODO: updated DDT, need to update these settings when deploying
# # See: https://github.com/django-debug-toolbar/django-debug-toolbar#installation
# MIDDLEWARE_CLASSES += (
#     'debug_toolbar.middleware.DebugToolbarMiddleware',
# )
# 
# DEBUG_TOOLBAR_CONFIG = {
#     'INTERCEPT_REDIRECTS': False,
# }
########## END TOOLBAR CONFIGURATION

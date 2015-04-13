from common import *
from os import environ

########## DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
#DEBUG = bool(environ.get('DJANGO_DEBUG', ''))
DEBUG = environ.get('DJANGO_DEBUG', False)
DEBUG = False

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
ALLOWED_HOSTS = environ.get('ALLOWED_HOSTS', '*').split(',')

# ALLOWED_HOSTS = [
#    '.recal.io', # Allow domain and subdomains
#    '.recal.io.', # Also allow FQDN and subdomains
#    'herokuapp.com',
#    'localhost', # Allow foreman to run
# ]

SECRET_KEY = environ.get('DJANGO_SECRET_KEY', 'asdfasfshjkxhvkzjxhiu1012u4-9r0iojsof')

def get_cache():
  try:
    environ['MEMCACHE_SERVERS'] = environ['MEMCACHIER_SERVERS'].replace(',', ';')
    environ['MEMCACHE_USERNAME'] = environ['MEMCACHIER_USERNAME']
    environ['MEMCACHE_PASSWORD'] = environ['MEMCACHIER_PASSWORD']
    return {
        'default': {
            'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
            'LOCATION': 'my_cache_table',
            'TIMEOUT': 60 * 60
        },
        'memcache': {
            'BACKEND': 'django_pylibmc.memcached.PyLibMCCache',
            'TIMEOUT': 500,
            'BINARY': True,
            'OPTIONS': { 'tcp_nodelay': True }
        }
    }
  except:
    return {
      'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
      }
    }

CACHES = get_cache()

########## TOOLBAR CONFIGURATION
# See: https://github.com/django-debug-toolbar/django-debug-toolbar#installation
INSTALLED_APPS += (
    #'debug_toolbar',
)

# ADMINS = (('Naphat'), ('naphat.krit@gmail.com'))

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

LOGGING = {
    'version': 1,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
            },
        },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
            },
        }
    }

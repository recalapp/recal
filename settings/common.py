"""
Django settings for nice project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
from os.path import abspath, basename, dirname, join, normpath
from sys import path
import os

# PATH CONFIGURATION
# Absolute filesystem path to the Django project directory:
DJANGO_ROOT = dirname(dirname(abspath(__file__)))

# Absolute filesystem path to the top-level project folder:
SITE_ROOT = dirname(DJANGO_ROOT)

# Site name:
SITE_NAME = basename(DJANGO_ROOT)

# Add our project to our pythonpath, this way we don't need to type our project
# name in our dotted import paths:
path.append(DJANGO_ROOT)
# END PATH CONFIGURATION

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ''

# Application definition

INSTALLED_APPS = (
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admindocs',
    #'security',
    'tastypie',
    'cas',
    'course_selection'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #'security.middleware.XssProtectMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'cas.middleware.CASMiddleware',
    'minidetector.Middleware',
)

ROOT_URLCONF = 'urls'

WSGI_APPLICATION = 'course_selection.wsgi.application'

# START AUTHENTICATION CONFIGURATION

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'cas.backends.CASBackend',
)

CAS_SERVER_URL = 'https://fed.princeton.edu/cas/'

CAS_REDIRECT_URL = '/'

LOGIN_URL = '/login'

# END AUTHENTICATION CONFIGURATION

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/New_York'  # changed from 'EST'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

# Parse database configuration from $DATABASE_URL
#import dj_database_url
#DATABASES['default'] =  dj_database_url.config()
DATABASES = {
}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
#SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Static asset configuration
STATIC_ROOT = join(DJANGO_ROOT, 'staticfiles')

STATIC_HOST = os.environ.get('DJANGO_STATIC_HOST', '')
STATIC_URL = STATIC_HOST + '/static/'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    "django.core.context_processors.request",
)

STATICFILES_DIRS = (
    normpath(join(DJANGO_ROOT, 'course_selection', 'static')),
)

TEMPLATE_DIRS = [normpath(join(DJANGO_ROOT, 'course_selection', 'templates')),
                 ]

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',  # overwritten in prod.py
    },
    'resources': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 60
    }
}

# PDFTK for PDF GENERATION

PDFTK_BIN = os.environ.get('PDFTK_BIN', '')

# END PDFTK


########## WhiteNoise Settings #######################

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

########## WhiteNoise Settings END #######################

########## TastyPie Settings #######################
# this limit should be done per resource. see course_selection/api.py
## API_LIMIT_PER_PAGE = 50
########## TastyPie Settings END #######################

# GLOBAL VARIABLES
# TODO: is this still used? if not, we can remove it
# Use helper method nice.models.get_cur_semester() to get current Semester
# object.
CURR_TERM = 1162

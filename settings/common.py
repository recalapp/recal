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
import dj_database_url

########## PATH CONFIGURATION
# Absolute filesystem path to the Django project directory:
DJANGO_ROOT = dirname(dirname(abspath(__file__)))

# Absolute filesystem path to the top-level project folder:
SITE_ROOT = dirname(DJANGO_ROOT)

# Site name:
SITE_NAME = basename(DJANGO_ROOT)

# Add our project to our pythonpath, this way we don't need to type our project
# name in our dotted import paths:
path.append(DJANGO_ROOT)
########## END PATH CONFIGURATION

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ''

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = (
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'south',
    'cas',
    'colorfield',
    'nice'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'cas.middleware.CASMiddleware',
    'minidetector.Middleware'
)

ROOT_URLCONF = 'nice.urls'

WSGI_APPLICATION = 'nice.wsgi.application'

########## START AUTHENTICATION CONFIGURATION

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'cas.backends.CASBackend',
)

CAS_SERVER_URL = 'https://fed.princeton.edu/cas/'

CAS_REDIRECT_URL = '/'

LOGIN_URL = '/login'

########## END AUTHENTICATION CONFIGURATION

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/New_York' # changed from 'EST'

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

# Allow all host headers
ALLOWED_HOSTS = ['*']

# Static asset configuration
STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    "django.core.context_processors.request",
)

STATICFILES_DIRS = (
    normpath(join(DJANGO_ROOT, 'nice', 'static')),
)

TEMPLATE_DIRS = [normpath(join(DJANGO_ROOT, 'nice', 'templates'))]

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache', # overwritten in prod.py
    }
}

########## GLOBAL VARIABLES
CURR_TERM = 1144 # Use helper method nice.models.get_cur_semester() to get current Semester object.

### Reputation system

## For handling individual votes:
THRESHOLD_APPROVE = 4 #Threshold to approve a revision: +4
THRESHOLD_REJECT = -4 #Threshold to reject a revision: -4
REWARD_FOR_UPVOTING = 1 #For upvoting a revision: +1 -- regardless of what happens to this revision later
REWARD_FOR_DOWNVOTING = -1 # For downvoting a revision: -1 (this is why we don't tell them the voting scheme and only update their points count once a day).
# After each vote, we'll check for whether either threshold has been reached. If so, we approve or reject the revision.

## At time of approval:

REWARD_FOR_APPROVED_SUBMISSION = 10 # For having created a revision that is approved: +10
REWARD_FOR_PROPER_UPVOTE = 2 # For having upvoted a revision that is now approved: +2
REWARD_FOR_IMPROPER_DOWNVOTE = -5 # For having downvoted a revision that is now approved: -5

## At time of rejection:

REWARD_FOR_REJECTED_SUBMISSION = -15 # For having created a revision that is rejected: -15
REWARD_FOR_IMPROPER_UPVOTE = -1 #For having upvoted a revision that is rejected: -1
REWARD_FOR_PROPER_DOWNVOTE = 5 #For having downvoted a revision that is rejected: +5 (offsets the initial -1)

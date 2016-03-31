"""
WSGI config for nice project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/

04/05/2015: Using WhiteNoise to serve static files
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.prod")

from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise


# https://devcenter.heroku.com/articles/memcachier#django
# Fix django closing connection to MemCachier after every request (#11331)
from django.core.cache.backends.memcached import BaseMemcachedCache
BaseMemcachedCache.close = lambda self, **kwargs: None

application = DjangoWhiteNoise(get_wsgi_application())
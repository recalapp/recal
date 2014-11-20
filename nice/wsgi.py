"""
WSGI config for nice project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.prod")

# from nice import scrape
# from nice import names

# initialize database with all events and netids
# scrape.scrape_all()
# names.construct_netid_map()

from django.core.wsgi import get_wsgi_application
from dj_static import Cling
application = Cling(get_wsgi_application())

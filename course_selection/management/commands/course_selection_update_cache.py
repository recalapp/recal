import json

from course_selection.views import get_courses_by_term_code
from django.conf import settings
from django.core.cache import caches
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """Regenerate and set course caches."""
    help = '''Update the courses cache without any service interruptions.
    The semesters updated are the ones in settings.ACTIVE_TERMS.'''

    def handle(self, *args, **kwargs):
        for term_code in settings.ACTIVE_TERMS:
            results = get_courses_by_term_code(term_code)
            data = json.dumps(results)
            caches['courses'].set(term_code, data)

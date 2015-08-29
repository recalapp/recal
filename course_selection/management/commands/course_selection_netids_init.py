from django.core.management.base import BaseCommand

from course_selection import names


class Command(BaseCommand):

    def handle(self, *args, **options):
        names.construct_netid_map()
        self.stdout.write('course selection: netids scraped successfully')

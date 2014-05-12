from django.core.management.base import BaseCommand, CommandError

from nice import names

class Command(BaseCommand):
    def handle(self, *args, **options):
        names.construct_netid_map()
        self.stdout.write('netids scraped successfully')


from django.core.management.base import BaseCommand, CommandError

from course_selection import scrape

class Command(BaseCommand):
    def handle(self, *args, **options):
        scrape.scrape_all()
        self.stdout.write('course selection: courses scraped successfully')

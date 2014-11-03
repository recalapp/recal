from django.core.management.base import BaseCommand, CommandError

from nice import scrape

class Command(BaseCommand):
    def handle(self, *args, **options):
        scrape.scrape_all()
        self.stdout.write('scraped successfully')

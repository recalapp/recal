from django.core.management.base import BaseCommand, CommandError

from course_selection.models import User

class Command(BaseCommand):
    def handle(self, *args, **options):
        usernames = [x.username for x in User.objects.all()]
        for x in usernames:
            self.stdout.write(x + "\n")

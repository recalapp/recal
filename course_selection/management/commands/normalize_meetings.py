from django.core.management.base import BaseCommand

from course_selection.models import Meeting


class Command(BaseCommand):

    def handle(self, *args, **options):
        all_meetings = Meeting.objects.all()
        for meeting in all_meetings:
            # trim days into the first 10 chars
            meeting.days = meeting.days[:10]
            meeting.save()
        self.stdout.write('all days trimmed to 10 characters')

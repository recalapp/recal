from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def __check_schedules(self):
        from course_selection.models import Schedule
        from course_selection.models_invariants import check_schedule_invariants
        self.stdout.write('Checking invariants of schedules')
        for schedule in Schedule.objects.all():
            if not check_schedule_invariants(schedule):
                self.stdout.write('Schedule with id ' + unicode(schedule.id) + ' failed invariants test.')
        self.stdout.write('--------------------------------')

    def handle(self, *args, **options):
        self.__check_schedules()

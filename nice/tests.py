import datetime

from django.utils import timezone
from django.test import TestCase

from nice.models import *
from nice.queries import *


def enroll(uname):
	profile = User.objects.get(username=uname).profile
	user_in_section = User_Section_Table(user = profile, section=Section.objects.get(pk=1), add_date = get_current_utc())
	user_in_section.save()
	user_in_section2 = User_Section_Table(user = profile, section=Section.objects.get(pk=2), add_date = get_current_utc())
	user_in_section2.save()

def make_sample_events():
	e_group = Event_Group(section=Section.objects.get(pk=2))
	e_group_rev = Event_Group_Revision(start_date=datetime(2014,02,06,0,0,0).date(), end_date=datetime(2014,02,06,0,0,0).date(), modified_time=get_current_utc(), modified_user=User.objects.get(pk=0).profile, approved=True)
	e_group.save()

	e_group_rev.event_group=e_group
	e_group_rev.save()

	event = Event(group = e_group)
	event.save()

	event_rev = Event_Revision(event_description="Add a description...", 
        event_type= "PR", 
        event_end= datetime(2014,02,06,19,20,00),
        event_title= "Precept", 
        modified_user=User.objects.get(pk=0).profile,
        event_start= datetime(2014,02,06,18,30,00),
        approved= True,
        modified_time=get_current_utc(),
        event_location= "Stanhope Hall 101",
        event=event)
	event_rev.save()

def clean_up():
	User_Section_Table.objects.all().delete()
	clear_events()


class NewiceTestCase(TestCase):
	fixtures = ['initial_data.json', 'test_data.json',]
	usernames = ['bob', 'janet']

	def pre_run(self):
		enroll(self.usernames[0])
		make_sample_events()
	def post_run(self):
		clean_up()

class EventMethodTests(NewiceTestCase):
    pass
class EnrollmentMethodTests(NewiceTestCase):
	""" Handles testing for methods we use for class enrollment.
	This includes autocomplete, course and section selection, etc.
	"""

	def test_autocomplete_distinctness(self):
		"""
		Autocomplete should not duplicate cross-listed classes. That is, the number of results for "COS ELE 475", "COS 475", "ELE 475", and "COS ELE", and "475" should be the same.
		"""
		num_classes = []
		for s in ['COS ELE', 'COS ELE 475', 'COS 475', 'ELE 475', '475']:
			num_classes.append(len(search_classes(s)))
		for n in num_classes:
			self.assertEqual(n, num_classes[0])

	def test_num_users(self):
		# Validating that fixtures are imported properly
		self.assertEqual(User.objects.count(), 3)
		


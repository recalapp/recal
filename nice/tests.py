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

def make_sample_events(uname):
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
        approved= "S_AP",
        modified_time=get_current_utc(),
        event_location= "Stanhope Hall 101",
        event=event)
	event_rev.save()

	event_rev2 = Event_Revision(event_description="New description", 
        event_type= "PR", 
        event_end= datetime(2014,02,06,19,20,00),
        event_title= "Precept", 
        modified_user=User.objects.get(username=uname).profile,
        event_start= datetime(2014,02,06,18,30,00),
        approved= "S_PE",
        modified_time=get_current_utc(),
        event_location= "Stanhope Hall 101",
        event=event)
	event_rev2.save()
	return event, event_rev, event_rev2

def clean_up():
	User_Section_Table.objects.all().delete()
	clear_events()


class NewiceTestCase(TestCase):
	fixtures = ['initial_data.json', 'test_data.json',]
	usernames = ['bob', 'janet']

	def pre_run(self):
		enroll(self.usernames[0])
		return make_sample_events(self.usernames[0])
	def post_run(self):
		clean_up()

class EventMethodTests(NewiceTestCase):
    def test_best_revision_behavior(self):
    	"""
    	Test 4 cases:

    	* A user made a new revision since the last globally-approved revision
    		Expected: the user sees this one, but other users see the globally-approved revision.
    	* A user voted on an unapproved revision since the last globally-approved revision
    		Expected: the user sees the one they voted on, but other users see the globally-approved revision.
    	* A user voted on an unapproved revision before the last globally-approved revision
    		Expected: all users see the globally-approved revision.
		* Since the last globally-approved revision, there are new unapproved revision that the user hasn't interacted with (yet).
			Expected: all users see the globally-approved revision.



    	"""
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

class UnapprovedRevisionTests(NewiceTestCase):
	def purge_votes(self):
		Vote.objects.all().delete()
	
	def test_appears_in_queue(self):
		pass
	def test_vote_threshold_checks(self):
		pass
	def test_can_only_vote_once(self):
		pass
	def test_points_are_assigned_properly(self):
		pass
	def test_user_not_in_section_cant_vote(self):
		pass
	def test_user_cant_vote_on_their_own_content(self):
		self.purge_votes() # just in case
		event, event_rev, event_rev2 = self.pre_run()
		
		# try to vote on your own content
		user = event_rev2.modified_user
		username = user.user.username
		self.assertEqual(process_vote_on_revision(netid=username, isPositive=True, revision_id=event_rev2.pk), False)
		
		# try to vote on other person's content
		event_rev2.modified_user = get_community_user().profile # different owner now
		event_rev2.save()
		self.assertEqual(process_vote_on_revision(netid=username, isPositive=True, revision_id=event_rev2.pk), True)

		# verify that vote was created
		self.assertEqual(Vote.objects.all().count(), 1)
		
		self.purge_votes()
		self.post_run()



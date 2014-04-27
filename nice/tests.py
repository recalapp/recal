import datetime

from django.utils import timezone
from django.test import TestCase

from nice.models import *
from nice.queries import *

class EventMethodTests(TestCase):
    pass
class EnrollmentMethodTests(TestCase):
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

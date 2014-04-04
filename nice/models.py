from django.db import models

# Create your models here.
# To start using the database: python manage.py syncdb
# Run python manage.py sql nice to see SQL for our models.
# To apply a model: python manage.py syncdb again. (This changes in later versions of Django, beware!)

# Relationships note: 
# use foreign key for many to one rel
# use OneToOneField for one to one rel

class Section(models.Model):
    pass

class Event_Group(models.Model):
    # relationships
    section = models.ForeignKey(Section)
    best_revision = models.OneToOneField('Event_Group_Revision')
    
class Event_Group_Revision(models.Model):
	# relationships
	event_group = models.ForeignKey(Event_Group)

	# main fields
	start_date = models.DateTimeField()
	end_date = models.DateTimeField()

	# recurrence fields
	'''
	* How recurrence fields work, for our prototype:
	* Days of the week are 0-6, with 0 = sunday and 6 = saturday
	* Field recurrenceDays is a list of integers: the digits of the days when the event reoccurs. This list is JSON serialized to be stored in the database.
	* Field reccurenceInterval = 1 or 2, i.e. repeat every week or repeat every other week
	'''
	recurrence_days = models.CharField(max_length=300, default=None, blank=True, null=True) # default value is None; blank=True means that you can pass in None; null=True tells Postgres to accept null values.
	recurrence_interval = models.IntegerField(default=None, blank=True, null=True)

class Event(models.Model):
    # relationships
    group = models.ForeignKey(Event_Group)
    #best_revision = models.ForeignKey(Event_Revision, rel_class=models.OneToOneRel)
    
class Event_Revision(models.Model):
    TYPE_ASSIGNMENT = "AS"
    TYPE_EXAM = "EX"
    TYPE_LAB = "LA"
    TYPE_LECTURE = "LE"
    TYPE_OFFICE_HOURS = "OH"
    TYPE_PRECEPT = "PR"
    TYPE_REVIEW_SESSION = "RS"
    TYPE_CHOICES = (
        (TYPE_ASSIGNMENT, "assignment"),
        (TYPE_EXAM, "exam"),
        (TYPE_LAB, "lab"),
        (TYPE_LECTURE, "lecture"),
        (TYPE_OFFICE_HOURS, "office hours"),
        (TYPE_PRECEPT, "precept"),
        (TYPE_REVIEW_SESSION, "review session")
    )

    # relationships
    event = models.ForeignKey(Event)

    # fields
    event_title = models.CharField(max_length=100)
    event_type = models.CharField(max_length=2, choices=TYPE_CHOICES)
    event_date = models.DateTimeField()
    event_description = models.TextField()
    event_location = models.CharField(max_length=100)
    # TODO modified_user = 
    modified_time = models.DateTimeField()
    approved = models.BooleanField(default=True) # TODO change default value

	

# Extend django.contrib.auth User table with custom user profile information.

from django.contrib.auth.models import User
class UserProfile(models.Model):
    user = models.OneToOneField(User)
	# put user profile fields here
    netid = models.CharField(max_length=30)
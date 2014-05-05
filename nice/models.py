from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from colorfield.fields import ColorField
from django.core.cache import cache

# Create your models here.
# To start using the database: python manage.py syncdb
# Run python manage.py sql nice to see SQL for our models.
# To apply a model: python manage.py syncdb again. (This changes in later versions of Django, beware!)

# Relationships note: 
# use foreign key for many to one rel
# use OneToOneField for one to one rel

import datetime

def get_current_utc():
    '''
    Returns current time in UTC, perfect for database storage.
    '''
    from django.utils.timezone import utc
    return datetime.datetime.utcnow().replace(tzinfo=utc)


class Semester(models.Model):
    # fields
    start_date = models.DateField() #TODO should this be datetime instead of date?
    end_date = models.DateField()
    """ term_code = 1xxy, where xx is the year in which the school year ends,
        and y is the semester code. y = 2 for the fall term, y = 4 for the spring
        Example:
        1144 = 1314Spring
        1132 = 1213Fall
    """
    term_code = models.CharField(max_length=4, default='1144')

    def __unicode__(self):
        end_year = int(self.term_code[1:3])
        start_year = end_year - 1
        if self.term_code[3] is '2':
            sem = 'Fall'
        else:
            sem = 'Spring'
        return str(start_year) + str(end_year) + sem


class Course(models.Model):
    # relationships
    semester = models.ForeignKey(Semester)

    # fields
    title = models.TextField()
    description = models.TextField()
    professor = models.CharField(max_length=100, null=True, blank=True)
    registrar_id = models.CharField(max_length=20)

    def course_listings(self):
        return " / ".join([unicode(course_listing) for course_listing in self.course_listing_set.all().order_by('dept')]) #+ ' ' + ': ' + self.title

    course_listings.admin_order_field = 'course_listings'

    # TODO: test this function
    def primary_listing(self):
        """
        returns a string
        """
        return unicode(self.course_listing_set.all().get(is_primary=True))

    def __unicode__(self):
        return " / ".join([unicode(course_listing) for course_listing in self.course_listing_set.all().order_by('dept')]) #+ ' ' + ': ' + self.title

    class Meta:
        pass
        # ordering = ['semester', 'course_listings']

class Course_Listing(models.Model):
    course = models.ForeignKey(Course)
    # Even though the max_length should be 3~4, there are extreme cases.
    dept = models.CharField(max_length=10)
    number = models.CharField(max_length=10)
    is_primary = models.BooleanField(default=False)

    def __unicode__(self):
        return self.dept + ' ' + self.number

    class Meta:
        ordering = ['dept', 'number']

class Section(models.Model):
    TYPE_ALL = "ALL"
    TYPE_CLA = "CLA"
    TYPE_DRI = "DRI"
    TYPE_LAB = "LAB"
    TYPE_LECTURE = "LEC"
    TYPE_PRECEPT = "PRE"
    TYPE_CHOICES = (
        (TYPE_ALL, "all students"),
        (TYPE_CLA, "class"),
        (TYPE_DRI, "drill"),
        (TYPE_LAB, "lab"),
        (TYPE_LECTURE, "lecture"),
        (TYPE_PRECEPT, "precept"),
    )

    # relationships
    course = models.ForeignKey(Course)

    # fields
    name = models.CharField(max_length=100, default='all_students')
    isDefault = models.BooleanField(default=False) # if true, then everyone in the course is automatically enrolled in this section
    section_type = models.CharField(max_length=3, choices=TYPE_CHOICES)

    def __unicode__(self):
        return unicode(self.course) + ' - ' + self.name
        
    class Meta:
        ordering = ['course', 'name']
        
# create "All Students" section as soon as a course is created
def make_default_table(sender, instance, created, **kwargs):  
    # see http://stackoverflow.com/a/965883/130164
    if created:  
       profile, created = Section.objects.get_or_create(course=instance, name='All Students', isDefault=True, section_type="ALL")  

# this call creates the "All Students" section
post_save.connect(make_default_table, sender=Course)

class User_Section_Table(models.Model):
    """
    only 5 default colors
    """
    COLOR_1 = '#8441A5'
    COLOR_2 = '#306278'
    COLOR_4 = '#339213'
    COLOR_5 = '#D60030'
    COLOR_6 = '#6B2119'

    COLOR_CHOICES = (
        (COLOR_1, 'purple'),
        (COLOR_2, 'light blue'),
        (COLOR_4, 'green'),
        (COLOR_5, 'red'),
        (COLOR_6, 'persian plum'),
    )
    # relationships
    user = models.ForeignKey('User_Profile')
    section = models.ForeignKey(Section)
    color = ColorField(default=COLOR_CHOICES[0][0])

    # fields
    add_date = models.DateTimeField()

    def get_usable_color(self):
        section_tables = User_Section_Table.objects.filter(user=self.user).exclude(section=self.section)
        for color_tuple in self.COLOR_CHOICES:
            curr_available = True
            for table in section_tables:
                if table.section.course.id == self.section.course.id:
                    return table.color
                if table.color == color_tuple[0]:
                    curr_available = False
                    break
            if curr_available:
                return color_tuple[0]
        return '#550000'

    def __unicode__(self):
        return self.user.__unicode__() + ' enrolled in ' + unicode(self.section)

class Event_Group(models.Model):
    # relationships
    section = models.ForeignKey(Section)
    registrar_id = models.CharField(max_length=10, null=True, blank=True)

    def __unicode__(self):
        if self.best_revision():
            return 'Event group: ' +  self.best_revision().__unicode__() + ' in ' + self.section.__unicode__()
        return 'Event group %d: no approved revision' % (self.id) +  ' in ' + unicode(self.section)

    def best_revision(self):
        # TODO(Maxim): show different revisions for different users?
        if self.event_group_revision_set.all():
            return self.event_group_revision_set.filter(approved=True).latest('modified_time')
        return None;
    
class Event_Group_Revision(models.Model):
    # relationships
    event_group = models.ForeignKey(Event_Group)

    # main fields
    start_date = models.DateField()
    end_date = models.DateField() # stores end date of recurring series
    modified_user = models.ForeignKey('User_Profile')
    modified_time = models.DateTimeField()
    approved = models.BooleanField(default=True) # TODO: change default value	
    
    # recurrence fields
    '''
    * How recurrence fields work, for our prototype:
    * Days of the week are 0-6, with 0 = sunday and 6 = saturday
    * Field recurrenceDays is a list of integers: the digits of the days when the event reoccurs. This list is JSON serialized to be stored in the database.
    * Field reccurenceInterval = 1 or 2, i.e. repeat every week or repeat every other week
    '''
    recurrence_days = models.CharField(max_length=300, default=None, blank=True, null=True) # default value is None; blank=True means that you can pass in None; null=True tells Postgres to accept null values.
    recurrence_interval = models.IntegerField(default=None, blank=True, null=True)

    def __unicode__(self):
        return unicode(self.start_date)

class Event(models.Model):
    # relationships
    group = models.ForeignKey(Event_Group)

    def __unicode__(self):
        if self.best_revision():
            return 'event %d: %s' % (self.id, unicode(self.best_revision()))
        return 'event %d: no approved revisions' % (self.id)
    def best_revision(self, netid=None):
        """
        Returns the best event revision to show to a user.
        
        Returns: the latest approved revision or the user's own version -- whichever is newer.
        
        That is, if there's a new approved revision after a user's own version, they see the new approved one.
        Or if they've changed the event since the last approved revision, even if their revision hasn't been approved yet for global viewing,
        they still see their revision.
        
        Arguments: username (optional). If not specified, returns globally-seen last approved revision.
        """
        if self.event_revision_set.exists():
            # Choose either the last approved revision or the last revision this user made, whichever is newer
            latest_approved = self.event_revision_set.filter(Q(approved=Event_Revision.STATUS_APPROVED) | Q(modified_user__user__username=netid)).order_by('-modified_time').first()

            if netid:
                # Compare to revisions for this event that the user has voted on
                event_vote = Vote.objects.filter(voter__user__username = netid).filter(voted_on__event__pk=self.pk).filter(voted_on__approved=Event_Revision.STATUS_PENDING).filter(score=1).order_by('-when').first() # upvote on some revision of this event
                if not latest_approved or (event_vote and event_vote.voted_on.modified_time > latest_approved.modified_time): # if the upvoted revision is newer than the last approved revision, then show the upvoted revision instead.
                    latest_approved = event_vote
            return latest_approved # show the latest approved revision because the user's revisions don't exist or are older
        return None # no revisions available

class Event_Revision(models.Model):
    # constants
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

    STATUS_APPROVED = "S_AP"
    STATUS_PENDING = "S_PE"
    STATUS_REJECTED = "S_RE"
    STATUS_CHOICES = (
        (STATUS_APPROVED, "Approved"),
        (STATUS_PENDING, "Pending"),
        (STATUS_REJECTED, "Rejected")
    )

    # relationships
    event = models.ForeignKey(Event)

    # fields
    event_title = models.CharField(max_length=100)
    event_type = models.CharField(max_length=2, choices=TYPE_CHOICES)
    event_start = models.DateTimeField()
    event_end = models.DateTimeField()
    event_description = models.TextField()
    event_location = models.CharField(max_length=100)
    modified_user = models.ForeignKey('User_Profile')
    modified_time = models.DateTimeField()
    approved = models.CharField(max_length=4, choices=STATUS_CHOICES, default=STATUS_PENDING)
    
    def __unicode__(self):
        return self.event_title # TODO: improve the way that revisions appear in admin panel by changing this.

    # Compare to another revision. (Based on https://djangosnippets.org/snippets/2281/)
    def compare(self, obj):
        excluded_keys = ['event', 'modified_user', 'modified_time', 'approved', 'event_start', 'event_end']
        return self._compare(self, obj, excluded_keys)

    def _compare(self, obj1, obj2, excluded_keys):
        d1, d2 = obj1.__dict__, obj2.__dict__
        old, new = {}, {}
        for k,v in d1.items():
            if k in excluded_keys:
                continue
            try:
                if v != d2[k]:
                    old.update({k: v})
                    new.update({k: d2[k]})
            except KeyError:
                old.update({k: v})
        
        return old, new  

    def apply_changes(self, new_values):
        """Accepts the new dict from compare()'s output, and then applies changes to this object. Don't forget to save!

        """
        for attr, value in new_values.iteritems(): # http://stackoverflow.com/a/7535133/130164
            setattr(self, attr, value)

# Extend django.contrib.auth User table with custom user profile information.

from django.contrib.auth.models import User

class User_Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', unique=False)
    
    name = models.CharField(max_length=100, null=True, blank=True)
    lastActivityTime = models.DateTimeField() 	# last seen time
    sections = models.ManyToManyField(Section, through='User_Section_Table', blank=True,null=True)
    ui_state_restoration = models.TextField(blank=True,null=True)
    hidden_events = models.TextField(blank=True,null=True)
    ui_agenda_pref = models.TextField(blank=True,null=True)
    ui_calendar_pref = models.TextField(blank=True,null=True)
    ui_pref = models.TextField(blank=True,null=True) # msc. pref, like themes

    # Reputation system
    current_points = models.IntegerField(default=0, blank=True) # The publicly-visible count the user sees. Updated once a day.

    def __unicode__(self):
        """
        Returns "[first_name] [last_name]" if both fields available, or "[first_name]" if only first name is given, or netid if neither names are filled in.
        
        Arguments: User object
        """
        
        netid, first, last = self.user.username, self.user.first_name, self.user.last_name
        # No need to escape in this method; templates will automatically escape strings we pass in.
        if first and last:
            return '%s %s' % (first, last)
        elif first:
            return first
        else:
            return netid

    def get_point_count(self):
        """Get user's point count

        This method's output is cached for 5 minutes so that we don't have to hit the database after every refresh. Maybe also poll the server from client side every 5 minutes for a new point count?

        Procedure:

        Check cache to see if we already have a cached point count for this user.
        Compare current date & time to "Last point update time".
        If difference is less than 24 hours, then return "Current points".
        If difference is more than 24 hours, "Current points" += "Pending points", "Pending points" -> 0, and return "Current points".
        Before returning anything, put it in cache with a 5 minute expiration.

        """
        
        cache_key = 'points_%s' % self.user.username
        points = cache.get(cache_key)
        if not points:
            points = self.current_points
            cache.set(cache_key, points, 60*10) # caches for 10 minutes
        return points
    
    def award_points(self, score, reward_type, when=get_current_utc(), why=None):
        """Safely awards [score] points to this user."""
        # Add to PointChanges. That way, we can recalculate points later, and also show the user why they gained/lost points.
        pc = PointChange(when=when, why=why, score=score, user=self, relationship=reward_type)
        pc.save()

        # Add to current points
        self.current_points = self.current_points + score
        self.save()

        # Invalidate cache entry
        cache.delete('points_%s' % self.user.username)

    def recalculate_points(self):
        from django.db.models import Sum
        sum_vals = PointChange.objects.filter(user=self).aggregate(Sum('score'))['score__sum']
        self.current_points = sum_vals if sum_vals else 0
        self.save()

        # Invalidate cache entry
        cache.delete('points_%s' % self.user.username)

		
# create user profile as soon as a user is added
def make_blank_profile(sender, instance, created, **kwargs):  
    # see http://stackoverflow.com/a/965883/130164
    # Use a try because the first user (super user) is created before other tables are created.
    # That is, this fails during syncdb upon initial database setup, because it creates a superuser before User_Profile table is added (we add that by running migrations after).
    try:
        if created:  
            profile, created = User_Profile.objects.get_or_create(user=instance,lastActivityTime=get_current_utc()) 
    except Exception, e:
        pass
     
post_save.connect(make_blank_profile, sender=User)


class Vote(models.Model):
    """Reputation system"""
    # relationships
    voter = models.ForeignKey('User_Profile') # the user who voted
    voted_on = models.ForeignKey('Event_Revision') # which revision was voted on

    # main fields
    when = models.DateTimeField() # when the vote was placed
    score = models.IntegerField(default=1) # +1 or -1: upvote or downvote
    
    def __unicode__(self):
        return 'Vote by ' + unicode(self.voter) + ' on ' + unicode(self.voted_on)

class PointChange(models.Model):
    """Reputation system -- point award tracking"""

    # relationships
    user = models.ForeignKey('User_Profile') # the user whose points we're dealing with
    why = models.ForeignKey('Event_Revision', null=True, blank=True) # which revision this point change stems from

    # main fields
    when = models.DateTimeField() # when the change was made
    score = models.IntegerField() # change in point count from this

    # a field for the explanation of the point change
    REL_GOOD_SUBMITTER = 1
    REL_BAD_SUBMITTER = 2
    REL_UPVOTER = 3
    REL_DOWNVOTER = 4
    REL_PROPER_UPVOTER = 5
    REL_IMPROPER_UPVOTER = 6
    REL_PROPER_DOWNVOTER = 7
    REL_IMPROPER_DOWNVOTER = 8
    REL_OTHER = 9 
    # Use below text in point history explanation window. Preface with "Reward for".
    REL_CHOICES = (
        (REL_GOOD_SUBMITTER, "an Approved Submission"),
        (REL_BAD_SUBMITTER, "a Rejected Submission"),
        (REL_UPVOTER, "an Upvote"),
        (REL_DOWNVOTER, "a Downvote"),
        (REL_PROPER_UPVOTER, "an Upvote of an Approved Submission"),
        (REL_IMPROPER_UPVOTER, "an Upvote of a Rejected Submission"),
        (REL_PROPER_DOWNVOTER, "a Downvote of a Rejected Submission"),
        (REL_IMPROPER_DOWNVOTER, "a Downvote of an Approved Submission"),
        (REL_OTHER, "Other")
    )

    relationship = models.IntegerField(choices=REL_CHOICES, default=REL_OTHER) 




### HELPER METHODS        
    
    
def get_community_user():
    """
    Returns the User object of the Community User, who is created during migration from the fixtures/initial_data.json file. 
    
    The Community User is meant to own imported/scraped events.
    """
    return User.objects.get(pk=0)
    
def clear_all_data():
    # TODO: add other tables
    Section.objects.all().delete()
    Course.objects.all().delete()
    Semester.objects.all().delete()

def clear_events():
    Event_Revision.objects.all().delete()
    Event.objects.all().delete()
    Event_Group_Revision.objects.all().delete()
    Event_Group.objects.all().delete()

    
def get_cur_semester():
    import settings.common as settings
    try:
        return Semester.objects.get(term_code = settings.CURR_TERM)
    except: # CURR_TERM is invalid or not specified
        return Semester.objects.order_by('-term_code')[0] # order by descending term code to get the latest semester.


def get_recurrence_dates(start_date, end_date, recurrence_end, recurrence_pattern, r_int):
    """
    Computes dates when this event recurrs in this interval.

    This doesn't change time of day, just adds days per recurrence_pattern and recurrence_interval.
    Arguments:
        * start_date
        * recurrence_pattern : a list of integer that correspond to day of the week. 0 is Monday, 6 is Sunday (per datetime convention in Python)
        * reccurence_interval : how many weeks apart the events are. That is, this answer the question: do the events recurr every week, every other week, or once every three weeks?
    """
    from datetime import timedelta
    week_start = start_date - timedelta(days=start_date.weekday()) # get date of day 0 (Monday) of week that includes start_date 
    event_span = end_date - start_date
    event_dates = []
    while week_start.date() <= recurrence_end:
        for day_of_week in recurrence_pattern:
            new_date = week_start + timedelta(days=day_of_week)
            if start_date.date() <= new_date.date() <= recurrence_end:
                event_dates.append((new_date, new_date + event_span)) # start datetime and end datetime of this event
        
        week_start = week_start + timedelta(days=(r_int*7)) # move to next week to consider (or jump multiple weeks)
    
    return event_dates
    
        

from django.utils.dateformat import format
from django.utils import timezone

import json

from nice.models import *
from datetime import *

# TODO(Naphat, Maxim): Should we switch netid parameter inputs to User object inputs from request.user? May save a database call.

def get_events(netid, **kwargs):
    try:
        user = User.objects.get(username=netid).profile
    except Exception, e:
        return []
    last_updated = kwargs.pop('last_updated', None)
    start_date = kwargs.pop('start_date', None)
    end_date = kwargs.pop('end_date', None)
    all_sections = user.sections.all()
    hidden_events = user.hidden_events
    if hidden_events:
        hidden_events = json.loads(hidden_events)
    else:
        hidden_events = []
    filtered = Event.objects.filter(group__section__in = all_sections)
    survived = []
    for event in filtered:
        best_rev = event.best_revision(netid=netid) # load the best revision once
        # conditions we don't want are below -- if any are matched, continue to the next event
        if not best_rev or best_rev is None:
            continue
        if start_date and best_rev.event_start < start_date:
            continue
        if end_date and best_rev.event_end > end_date:
            continue
        if last_updated and best_rev.modified_time < last_updated:
            continue
        if event.id in hidden_events:
            continue
        # if we made it to here, then the event is good
        survived.append(construct_event_dict(event, netid=netid, best_rev=best_rev))
    return survived

def get_events_by_course_ids(course_ids, **kwargs):
    courses = [Course.objects.get(id=course_id) for course_id in course_ids]
    last_updated = kwargs.pop('last_updated', None)
    start_date = kwargs.pop('start_date', None)
    end_date = kwargs.pop('end_date', None)
    filtered = Event.objects.filter(group__section__course__in=courses)
    if start_date:
        filtered = [event for event in filtered if event.best_revision().event_start >= start_date]
    if end_date:
        filtered = [event for event in filtered if event.best_revision().event_start <= end_date]
    if last_updated:
        filtered = [event for event in filtered if event.best_revision().modified_time > last_updated]
    return [construct_event_dict(event) for event in filtered]

def modify_events(netid, events):
    """ 
    Handles event creation and modification.

    Properties of event_dicts -- what to pass to modify_events if calling manually:
        * event_start
        * event_end (for the first event)
        * event_title
        * event_group_registrar_id
        * event_description
        * event_location
        * event_id (default: None)
        * event_type 
        * section_id
        * recurrence_days
        * recurrence_interval   
        * recurrence_end (end date for the recurring series)

    For example, you can call this with: modify_events(get_community_user().username, [{...}])

    """
    try:
        user = User.objects.get(username=netid).profile
    except:
        raise Exception("Invalid user")
    changed_ids = {}
    for event_dict in events:
        event_dict = parse_json_event_dict(event_dict) # handles datetimes and such
        new_modified_time = get_current_utc() # don't trust client's timestamps
        
        # Make new event group revision now, so we can do comparisons before deciding whether to use it
        new_event_group_rev = Event_Group_Revision(
            start_date = event_dict['event_start'].date(),
            end_date = event_dict['event_start'].date(),
            modified_user = user,
            modified_time = new_modified_time
        )
        if 'event_end' in event_dict:
            new_event_group_rev.end_date = event_dict['event_end'].date()
        if 'recurring' in event_dict and event_dict['recurring'] is True:
            # Set recurrence properties if they are available.
            new_event_group_rev.recurrence_days = json.dumps(event_dict['recurrence_days'])
            new_event_group_rev.recurrence_interval = event_dict['recurrence_interval']
            new_event_group_rev.end_date = min(event_dict['recurrence_end'], get_cur_semester().end_date) # note that recurrence_end is already a datetime.date
        else:
            # If not, set them to their default values of None.
            new_event_group_rev.recurrence_days = None
            new_event_group_rev.recurrence_interval = None
            
        isNewEvent = False

        # Decide whether to edit existing event, or make new event.
        try:
            event = Event.objects.get(id=event_dict['event_id'])
            # If we made it here, then event already exists.
            event_group = event.group;
            section = Section.objects.get(id=event_dict['section_id'])
            event_group.section = section;
            event_group.save();

            previous_best_revision = event.best_revision(netid=netid)
            
            ## Decide whether we need a new event group revision.
            last_rev = event_group.best_revision() # get last event_group revision
            
            # Compare last event_group revision to new start_date, end_date, recurrence fields
            event_groups_match = True # use boolean rather than a huge if statement
            recurrence_has_changed = False # used in recurring events handling further down
            if last_rev.start_date != new_event_group_rev.start_date or last_rev.end_date != new_event_group_rev.end_date:
                event_groups_match = False 
            elif 'recurring' in event_dict and event_dict['recurring'] is True: # recurrence is enabled in updated event_dict
                if (last_rev.recurrence_days != new_event_group_rev.recurrence_days):
                    event_groups_match = False
                    recurrence_has_changed = True
                if (last_rev.recurrence_interval != new_event_group_rev.recurrence_interval):
                    event_groups_match = False
                    recurrence_has_changed = True
            elif 'recurring' in event_dict and event_dict['recurring'] is False: # recurrence is disabled in updated event_dict
                if last_rev.recurrence_days is not None or last_rev.recurrence_interval is not None:
                    event_groups_match = False
                    recurrence_has_changed = True
            
            # If we concluded that event groups don't match, save new event group revision
            if not event_groups_match:
                new_event_group_rev.event_group = event_group
                new_event_group_rev.save()
            
        except:
            # event lookup failed -- i.e. event doesn't exist yet
            isNewEvent = True
            # create a new event group to hold the event
            section = Section.objects.get(id=event_dict['section_id'])

            ## pass it a registrar id as well
            # TODO TODO TODO: Dyland: fix this
            event_group = Event_Group(section=section)
        
            if 'event_group_registrar_id' in event_dict:
                event_group.registrar_id = event_dict['event_group_registrar_id']
            
            # save the event group
            event_group.save()
            new_event_group_rev.event_group = event_group
            new_event_group_rev.save()
            
            # create the actual event
            event = Event(group=event_group)
            event.save()
            changed_ids[event_dict['event_id']] = event.id
        
        
        # Now that we have a new or existing event selected, create a new revision.
        def make_new_rev(e):
            return Event_Revision(
                event = e,
                event_title = event_dict['event_title'],
                event_type = event_dict['event_type'],
                event_start = event_dict['event_start'],
                event_end = event_dict['event_end'],
                event_description = event_dict['event_description'],
                event_location = event_dict['event_location'],
                modified_user = user,
                modified_time = new_modified_time
            )
        eventRev = make_new_rev(event)
        # Save
        eventRev.save()
        event.save()

        ## Handle recurring events
        if event_dict['recurring'] is True:
            event_dates = get_recurrence_dates(event_dict['event_start']+timedelta(days=1),
                                                event_dict['event_end']+timedelta(days=1),
                                                new_event_group_rev.end_date,
                                                event_dict['recurrence_days'],
                                                event_dict['recurrence_interval'])   # events in this group starting with next day
        else:
            event_dates = [(event_dict['event_start'], event_dict['event_end'])]
        def create_new_events(dates):
            for d_start, d_end in dates:
                new_event = Event(group=event_group)
                new_event.save() 
                new_rev = make_new_rev(new_event)
                new_rev.event_start = d_start
                new_rev.event_end = d_end
                new_rev.save() # must have saved event first, so that revision points to an event ID
                # Note that we don't need to add to changed_ids; the next server poll will grab the new events
        if isNewEvent:
            # This is a new event group.
            # Per recurrence pattern, make more events with copies of this event revision.
            if event_dict['recurring'] is True:
                create_new_events(event_dates)
        else:
            # This is not a new event group.
            if recurrence_has_changed:
                # Recurrence pattern has changed.

                if last_rev.recurrence_days is None: # no previous recurrence pattern
                    # Make all new events with this same event revision
                    create_new_events(event_dates)
                else:
                    # Previous recurrence pattern has changed -- need to find the previous-created events and move them
                    # By default, only edit the ones after this event
                    
                    # find and remove old events
                    old_events = event_group.event_set.filter(start_date__gte = event_dict['event_start'])
                    old_events.delete()

                    # recreate events at their new times
                    create_new_events(event_dates)

            else:
                # Recurrence pattern hasn't changed.

                # Which fields have changed since previous revision? Compare to the best-revision this user sees (stored in previous_best_revision) -- not to the global last-approved revision.
                old, new = previous_best_revision.compare(new_rev)

                # By default, recurring event edit settings is to change all future events
                # Select all future events in this event group (other than this event)
                all_future_events = event_group.event_set.filter(start_date__gte = event_dict['event_start'])
                for future_event in all_future_events: # Edit each future event
                    # Take its last revision, as seen by this user
                    this_event_last_rev = future_event.best_revision()
                    # Edit the fields that have changed -- just overwrite (no matter if specific event changes have been made)
                    this_event_last_rev.apply_changes(new)
                    # Save as new unapproved revision.
                    this_event_last_rev.approved = False
                    this_event_last_rev.save() # Note: each of these revisions will have to be approved separately.
        
    return changed_ids

def hide_events(netid, event_IDs):
    """
    Adds events to user's hidden event list.
    
    Arguments: User object, event IDs list.
    
    Returns: True if succeeded, False if failed.
    """
    user = User.objects.get(username=netid).profile
    hidden_events = user.hidden_events
    if hidden_events:
        hidden_events = json.loads(hidden_events)
    else:
        hidden_events = []
    for event_id in event_IDs:
        try:
            event = Event.objects.get(id=event_id) # verify that id exists
            hidden_events.append(event.id)
        except Exception, e:
            pass # event doesn't exist, or something went wrong with hide events call (that's okay)
    user.hidden_events = json.dumps(hidden_events)
    user.save()
    
def get_hidden_events(netid):
    user = User.objects.get(username=netid).profile
    hidden_events = user.hidden_events
    if hidden_events:
        hidden_events = json.loads(hidden_events)
    else:
        hidden_events = []
    return hidden_events


def save_state_restoration(netid, state_restoration):
    try:
        user = User.objects.get(username=netid).profile
        user.ui_state_restoration = state_restoration
        user.save()
        return True
    except Exception, e:
        return False
    
def get_state_restoration(netid):
    try:
        user = User.objects.get(username=netid).profile
        return user.ui_state_restoration 
    except Exception, e:
        return None

def construct_event_dict(event, netid=None, best_rev=None):
    """
    Selects the best revision, then converts it into a dict for client-side rendering.
    """
    
    rev = best_rev
    if not rev:
        rev = event.best_revision(netid=netid)
    group = event.group
    group_rev = group.best_revision()
    assert rev != None and group != None and group_rev != None
    return __construct_revision_dict(rev, group, group_rev)
    
    
def __construct_revision_dict(rev, group, group_rev):
    """
    Serializes a specific revision into a dict that can be passed to the client for rendering.

    """
    results = {
        'event_id': rev.event.id,
        'event_group_id': rev.event.group.id,
        'event_title': rev.event_title,
        'event_type': rev.event_type, # pretty = get_event_type_display()
        'event_start': format(rev.event_start, 'U'),
        'event_end': format(rev.event_end, 'U'),
        'event_description': rev.event_description,
        'event_location': rev.event_location,
        'section_id': rev.event.group.section.id,
        'modified_user': rev.modified_user.user.username,
        'modified_time': format(rev.modified_time, 'U'),
    }
    if group_rev.recurrence_interval is not None:
        results['recurrence_days'] = group_rev.recurrence_days
        results['recurrence_interval'] = group_rev.recurrence_interval
        results['recurrence_end'] = format(group_rev.end_date, 'U')
    return results
    
def parse_json_event_dict(jsdict):
    """
    Parses JSON event dict into Python dict with proper Python objects (e.g. datetimes when necessary).
    
    """
    
    # Parse JSON if necessary
    if type(jsdict) is dict:
        event_dict = jsdict
    elif type(jsdict) is list:
        event_dict = jsdict[0]
    else: # str or unicode
        event_dict = json.loads(jsdict)
    
    # Handle datetimes
    def make_time_aware(timestamp):
        if type(timestamp) in [date, time, datetime]:
            return timezone.make_aware(timestamp, timezone.get_default_timezone())
        return timezone.make_aware(datetime.fromtimestamp(float(timestamp)), timezone.get_default_timezone())
    event_dict['event_start'] = make_time_aware(event_dict['event_start'])
    if 'event_end' in event_dict:
        event_dict['event_end'] = make_time_aware(event_dict['event_end'])
    if 'modified_time' in event_dict:
        event_dict['modified_time'] = make_time_aware(event_dict['modified_time'])
    
    # Clean up recurrence info
    event_dict['recurring'] = False
    if 'recurrence_days' in event_dict and 'recurrence_interval' in event_dict and 'recurrence_end' in event_dict:
        event_dict['recurring'] = True
        
        event_dict['recurrence_interval'] = int(event_dict['recurrence_interval'])
        if not 0 < event_dict['recurrence_interval'] < 12: # range for repetition interval
            raise Exception("Recurrence invalid")
        
        event_dict['recurrence_days'] = [int(i) for i in event_dict['recurrence_days']]
        
        default_recurrence_end = get_cur_semester().end_date # default value
        if 'recurrence_end' in event_dict and event_dict['recurrence_end'] is not None: # this field is optional
            default_recurrence_end = min(default_recurrence_end, make_time_aware(event_dict['recurrence_end']).date())
        event_dict['recurrence_end'] = default_recurrence_end

    else:
        event_dict['recurrence_days'] = None
        event_dict['recurrence_interval'] = None
        event_dict['recurrence_end'] = None
    return event_dict
    

    
import difflib # https://docs.python.org/2/library/difflib.html
import heapq
def __close_matches(actual_value, possibilities, get_value, n=3, cutoff=0.6):
    """Wrapper around difflib.get_close_matches() to support matching with more complicated data structures. Uses input function to select which field we compare on, but returns the full element and not just the compared field.
    
    Get_value is a function that is called with a revision and extracts the value we want to compare.
    
    From difflib.get_close_matches():
        Optional arg n (default 3) is the maximum number of close matches to
        return.  n must be > 0.

        Optional arg cutoff (default 0.6) is a float in [0, 1].  Possibilities
        that don't score at least that similar to word are ignored.

        The best (no more than n) matches among the possibilities are returned
        in a list, sorted by similarity score, most similar first.
        
    Examples:
        >>> __close_matches('abc', ['abcc', 'abc', 'abccc', 'abcccc'], lambda x: x)
        ['abc', 'abcc', 'abccc']
        
        >>> __close_matches('abc', [(0, 'abcc'), (1, 'abc'), (2, 'abccc'), (3, 'abcccc')], lambda x: x[1])
        [(1, 'abc'), (0, 'abcc'), (2, 'abccc')]
    
    """
    
    # Derived from: https://github.com/python-git/python/blob/715a6e5035bb21ac49382772076ec4c630d6e960/Lib/difflib.py, line 704
    result = []
    s = difflib.SequenceMatcher()
    s.set_seq2(actual_value)
    for x in possibilities:
        s.set_seq1(get_value(x))
        if s.real_quick_ratio() >= cutoff and \
           s.quick_ratio() >= cutoff and \
           s.ratio() >= cutoff:
            result.append((s.ratio(), x)) # notice that we're returning x, not get_value(x)

    # Move the best scorers to head of list
    result = heapq.nlargest(n, result)
    # Strip scores for the best n matches
    return [x for score, x in result]
    
    
def get_similar_events(event_dict):
    """
    When adding a new event, this fetches similar events that may be the one the user is trying to add now.
    
    Accepts: event_dict (dict as defined in construct_event_dict
    
    TODO(Maxim): make a similar function that creates event_dict from an existing revision and then uses this function to compare and merge revisions.
    
    How it works:

    - must match: section_id, event_type
    - must be similar (use a distance function): event_title, event_description, event_location -- on the lowercase version of string
    - must be within X minutes: event_start, event_end
    
    TODO(Maxim): enforce that returned stuff has different event ID; AND DEBUG
    
    """
    
    # Match section_id
    matched_section_events = Event.objects.filter(group__section_id = event_dict['section_id']) 
    
    # Match event type
    revisions = Event_Revision.objects.filter(event__in = matched_section_events).filter(event_type = event_dict['event_type']) 
    
    # Match time range
    time_d = timedelta(minutes=15)
    min_dt, max_dt = event_dict['event_start'] - time_d, event_dict['event_start'] + time_d
    
    revisions = revisions.filter(event_start__gte = min_dt, event_start__lte = max_dt) # start time >= minimum allowable start time AND start time <= maximum allowable start time. ("gte" = greater than or equals.)
    
    # Similar event titles
    revisions = __close_matches(event_dict['event_title'].lower(), revisions, lambda r: r.event_title.lower())
    
    # Similar event descriptions
    revisions = __close_matches(event_dict['event_description'].lower(), revisions, lambda r: r.event_description.lower())
    
    # Similar event locations
    revisions = __close_matches(event_dict['event_location'].lower(), revisions, lambda r: r.event_location.lower())
    
    return revisions # return what survived


def get_sections(netid):
    """
    returns:
    {
        course_id:[
            section_id
        ]
    }
    """
    user = User.objects.get(username=netid).profile
    ret = {}
    for section in user.sections.all():
        sections_array = ret.setdefault(section.course.id, [])
        sections_array.append(section.id)
    return ret

def get_course_by_id(course_id):
    """
    returns:
    {
        course_id:
        course_title:
        course_listings:
        course_professor:
        course_description:
        sections: {
            section_type:[
                section_id:
                section_name:
            ]
        }
    }
    """
    try:
        course = Course.objects.get(id=course_id)
        return construct_course_dict(course)
    except Exception, e:
        return {}
def construct_course_dict(course):
    sections_group = {}
    for section in course.section_set.all():
        sections_array = sections_group.setdefault(section.section_type, [])
        sections_array.append(construct_section_dict(section))
    return {
        'course_id': course.id,
        'course_title': course.title,
        'course_listings': course.course_listings(),
        'course_professor': course.professor,
        'course_description': course.description,
        'sections': sections_group,
    }

def construct_section_dict(section):
    return {
        'section_id': section.id,
        'section_name': section.name,
    }

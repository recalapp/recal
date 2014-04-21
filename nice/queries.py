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
    filtered = [event for event in filtered if event.best_revision(netid=netid) != None]
    if start_date:
        filtered = [event for event in filtered if event.best_revision(netid=netid).event_start >= start_date]
    if end_date:
        filtered = [event for event in filtered if event.best_revision(netid=netid).event_start <= end_date]
    if last_updated:
        filtered = [event for event in filtered if event.best_revision(netid=netid).modified_time > last_updated]
    return [construct_event_dict(event, netid=netid) for event in filtered if event.id not in hidden_events]

def modify_events(netid, events):
    # TODO add a try statement
    user = User.objects.get(username=netid).profile
    changed_ids = {}
    for event_dict in events:
        # TODO(Maxim): make below use the parse_dict function
        event_start = timezone.make_aware(datetime.fromtimestamp(float(event_dict['event_start'])), timezone.get_default_timezone())
        event_end = timezone.make_aware(datetime.fromtimestamp(float(event_dict['event_end'])), timezone.get_default_timezone())

        modified_time = timezone.make_aware(datetime.fromtimestamp(float(event_dict['modified_time'])), timezone.get_default_timezone())
        try:
            event = Event.objects.get(id=event_dict['event_id'])
            event_group = event.group;
            section = Section.objects.get(id=event_dict['section_id'])
            event_group.section = section;
            event_group.save();
            # TODO new event group rev?
        except:
            # create a new event group to hold the event
            section = Section.objects.get(id=event_dict['section_id'])
            event_group = Event_Group(section=section)
            event_group.save()
            event_group_rev = Event_Group_Revision(
                event_group = event_group,
                start_date = event_start.date(),
                end_date = event_start.date(),
                modified_user = user,
                modified_time = modified_time
            )
            # save the event group
            event_group_rev.save()
            # create the actual event
            event = Event(group=event_group)
            event.save()
            changed_ids[event_dict['event_id']] = event.id
        # create a new revision
        eventRev = Event_Revision(
            event = event,
            event_title = event_dict['event_title'],
            event_type = event_dict['event_type'],
            event_start = event_start,
            event_end = event_end,
            event_description = event_dict['event_description'],
            event_location = event_dict['event_location'],
            modified_user = user,
            modified_time = modified_time
        )
        # save
        eventRev.save()
        event.save()
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
        
def construct_event_dict(event, netid=None):
    """
    Selects the best revision, then converts it into a dict for client-side rendering.
    """
    
    rev = event.best_revision(netid=netid)
    assert rev != None
    return __construct_revision_dict(rev)
    
    
def __construct_revision_dict(rev):
    """
    Serializes a specific revision into a dict that can be passed to the client for rendering.
    """
    
    # TODO(Naphat): add recurrence info
    return {
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
        'modified_time': format(rev.modified_time, 'U')
    }
    
def parse_json_event_dict(jsdict):
    """
    Parses JSON event dict into Python dict with proper Python objects (e.g. datetimes when necessary).
    
    """
    
    # Parse JSON
    import json
    event_dict = json.loads(jsdict)
    if type(event_dict) == list:
        event_dict = event_dict[0]
    
    # Handle datetimes
    
    event_dict['event_start'] = timezone.make_aware(datetime.fromtimestamp(float(event_dict['event_start'])), timezone.get_default_timezone())
    
    event_dict['event_end'] = timezone.make_aware(datetime.fromtimestamp(float(event_dict['event_end'])), timezone.get_default_timezone())

    event_dict['modified_time'] = timezone.make_aware(datetime.fromtimestamp(float(event_dict['modified_time'])), timezone.get_default_timezone())
    
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
        sections: [
            section_id:
            section_name:
        ]
    }
    """
    try:
        course = Course.objects.get(id=course_id)
        return construct_course_dict(course)
    except Exception, e:
        return {}
def construct_course_dict(course):
    return {
        'course_id': course.id,
        'course_title': course.title,
        'course_listings': course.course_listings(),
        'course_professor': course.professor,
        'course_description': course.description,
        'sections': [construct_section_dict(section) for section in course.section_set.all()],
    }

def construct_section_dict(section):
    return {
        'section_id': section.id,
        'section_name': section.name,
    }

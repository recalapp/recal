from django.utils.dateformat import format
from django.utils import timezone

import json

from nice.models import *
from datetime import *
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
    filtered = []
    for section in all_sections:
        filtered += Event.objects.filter(group__section=section); 
    filtered = [event for event in filtered if event.best_revision() != None]
    if start_date:
        filtered = [event for event in filtered if event.best_revision().event_start >= start_date]
    if end_date:
        filtered = [event for event in filtered if event.best_revision().event_start <= end_date]
    if last_updated:
        filtered = [event for event in filtered if event.best_revision().modified_time > last_updated]
    return [__construct_event_dict(event) for event in filtered if event.id not in hidden_events]

def modify_events(netid, events):
    # TODO add a try statement
    user = User.objects.get(username=netid).profile
    changed_ids = {}
    for event_dict in events:
        event_start = timezone.make_aware(datetime.fromtimestamp(float(event_dict['event_start'])), timezone.get_default_timezone())
        event_end = timezone.make_aware(datetime.fromtimestamp(float(event_dict['event_end'])), timezone.get_default_timezone())

        modified_time = timezone.make_aware(datetime.fromtimestamp(float(event_dict['modified_time'])), timezone.get_default_timezone())
        try:
            event = Event.objects.get(id=event_dict['event_id'])
            # TODO new event group rev?
        except:
            # create a new event group to hold the event
            section = Section.objects.get(id=event_dict['section_id'])
            event_group = Event_Group(section=section)
            event_group_rev = Event_Group_Revision(
                event_group = event_group,
                start_date = event_start.date(),
                end_date = event_start.date(),
                modified_user = user,
                modified_time = modified_time
            )
            # save the event group
            event_group.save()
            event_group_rev.save()
            # create the actual event
            event = Event(group=event_group)
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

def __construct_event_dict(event):
    rev = event.best_revision()
    assert rev != None;
    # TODO add recurrence info
    eventDict = {
        'event_id': event.id,
        'event_group_id': event.group.id,
        'event_title': rev.event_title,
        'event_type': rev.event_type, # pretty = get_event_type_display()
        'event_start': format(rev.event_start, 'U'),
        'event_end': format(rev.event_end, 'U'),
        'event_description': rev.event_description,
        'event_location': rev.event_location,
        'section_id': event.group.section.id,
        'modified_user': rev.modified_user.user.username,
        'modified_time': format(rev.modified_time, 'U') # does this handle daylight savings?
    }
    return eventDict

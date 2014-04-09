from django.utils.dateformat import format
from nice.models import *
from datetime import *
def get_events(netid, start_date=None, end_date=None):
    try:
        user = User.objects.get(username=netid).profile
    except Exception, e:
        return []
    filterDict = {
        'event_visibility__is_hidden': False,
        'event_visibility__is_complete': False,
    }
    filtered = user.events.filter(**filterDict)
    filtered = [event for event in filtered if event.best_revision() != None]
    if start_date:
        filtered = [event for event in filtered if event.best_revision().event_date >= start_date]
    if end_date:
        filtered = [event for event in filtered if event.best_revision().event_date <= end_date]
    return [__construct_event_dict(event) for event in filtered if event.best_revision() != None]

def modify_events(netid, events):
    # TODO add a try statement
    user = User.objects.get(username=netid).profile
    for eventDict in events:
        eventDate = timezone.make_aware(datetime.fromtimestamp(float(eventDict.event_date)), timezone.get_default_timezone())
        modifiedTime = timezone.make_aware(datetime.fromtimestamp(float(eventDict.modified_time)), timezone.get_default_timezone())
        try:
            event = Event.objects.get(id=eventDict.event_id)
        except:
            # create a new event group to hold the event
            section = Section.objects.get(id=eventDict.section_id)
            eventGroup = Event_Group(section=section)
            eventGroupRev = Event_Group_Revision(
                event_group = eventGroup,
                start_date = eventDate.date(),
                end_date = eventDate.date(),
                modified_user = user,
                modified_time = modifiedTime
            )
            # save the event group
            eventGroup.save()
            eventGroupRev.save()
            # create the actual event
            event = Event(eventGroup)

        # create a new revision
        eventRev = Event_Revision(
            event = event,
            event_title = eventDict.event_title,
            event_type = eventDict.event_type,
            event_date = eventDate,
            event_description = eventDict.event_description,
            event_location = eventDict.event_location,
            modified_user = user,
            modified_time = modifiedTime
        )
        # save
        event.save()
        eventRev.save()

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
        'modified_user': rev.modified_user.netid,
        'modified_time': format(rev.modified_time, 'U') # does this handle daylight savings?
    }
    return eventDict
    
    

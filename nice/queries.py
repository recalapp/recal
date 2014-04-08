from nice.models import *
def get_events(netid, start_date=None, end_date=None):
    try:
        user = User_Profile.objects.get(netid=netid)
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

def __construct_event_dict(event):
    rev = event.best_revision()
    assert rev != None;
    # TODO add recurrence info
    eventDict = {
        'event_id': event.id,
        'event_group_id': event.group.id,
        'event_title': rev.event_title,
        'event_type': rev.get_event_type_display(), 
        'event_start': rev.event_start.strftime('%s'),
        'event_end': rev.event_end.strftime('%s'),
        'event_description': rev.event_description,
        'event_location': rev.event_location,
        'section_id': event.group.section.id,
        'modified_user': rev.modified_user.netid,
        'modified_time': rev.modified_time.strftime('%s') # does this handle daylight savings?
    }
    return eventDict

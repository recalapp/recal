from nice.models import *
def get_events(netid, start_date=None, end_date=None):
    user = User_Profile.objects.filter(netid=netid)[0]
    filterDict = {
        'event_visibility__is_hidden': False,
        'event_visibility__is_complete': False,
    }
    filtered = user.events.filter(**filterDict)
    return [construct_event_dict(event) for event in filtered if event.best_revision() != None]

def construct_event_dict(event):
    rev = event.best_revision()
    assert rev != None;
    # TODO add recurrence info
    eventDict = {
        'event_group_id': event.group.id,
        'event_title': rev.event_title,
        'event_type': rev.get_event_type_display(), 
        'event_date': rev.event_date.strftime('%s'),
        'event_description': rev.event_description,
        'event_location': rev.event_location,
        'modified_user': rev.modified_user.netid,
        'modified_time': rev.modified_time.strftime('%s') # does this handle daylight savings?
    }
    return eventDict

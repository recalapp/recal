var eventsManager = null;
var EventsMan_updateListeners = [];
var EventsMan_onReadyListeners = [];
var EventsMan_eventIDsChangeListener = [];
var EVENTS_INIT = false;
var EVENTS_READY = false;

function EventsMan_init(){};
function _EventsMan_new()
{
    this.events = {};
    this.order = []; // {start: "start", id: "id"}, keep sorted
    this.lastSyncedTime = 0; // will be set when populating
    this.addedCount = 0;
    //this.deletedIDs = [];
    this.updatedIDs = new Set(); // if it is in updatedIDs, it'll be pushed on the next connection
    this.uncommitted = {}; // copies of events dict with uncommitted changes, once saved, the event dict is copied to eventsManager.events, and its ID is added to updatedIDs
    this.hiddenIDs = new Set();
    this.changed = false; // true if hidden IDs have changed and not been pushed
    this.isIdle = true;
    this.showHidden = false;
    return this;
}
function EventsMan_constructOrderArray()
{
    eventsManager.order = [];
    $.each(eventsManager.events, function(key, eventDict){
        eventsManager.order.push({'event_start': eventDict.event_start, 'event_id': key}); 
    });
    eventsManager.order.sort(function(a,b){
        return parseInt(a.event_start) - parseInt(b.event_start);
    });
}
/**************************************************
 * Client methods
 * These are strictly interactions between the event
 * manager and the client. It does NOT talk to 
 * the server.
 **************************************************/

function EventsMan_showHidden(hide)
{
    if (typeof hide != 'undefined')
    {
        eventsManager.showHidden = hide;
        _EventsMan_callUpdateListeners();
    }
    return eventsManager.showHidden;
}
 //{
//    'event_group_id': event.group.id,
//    'event_title': rev.event_title,
//    'event_type': rev.get_event_type_display(), 
//    'event_date': rev.event_date.strftime('%s'),
//    'event_description': rev.event_description,
//    'event_location': rev.event_location,
//    'section_id': event.group.section.id,
//    'modified_user': rev.modified_user.netid,
//    'modified_time': rev.modified_time.strftime('%s') 
//}
function EventsMan_getEventByID(id)
{
    return eventsManager.events[id];
}
function EventsMan_hasEvent(id)
{
    return (id in eventsManager.events) || (id in eventsManager.uncommitted);
}

function EventsMan_getEventIDForRange(start, end)
{
    var i = 0;
    while (i < eventsManager.order.length && eventsManager.order[i].event_start < start)
        i++;
    var iStart = i;
    while (i < eventsManager.order.length && eventsManager.order[i].event_start < end)
        i++;
    var iEnd = Math.min(i, eventsManager.order.length); // slice method is exclusive on the right end
    var events = eventsManager.order.slice(iStart, iEnd);
    var ret = [];
    for (var i = 0; i < events.length; i++)
        if (EventsMan_showHidden() || !EventsMan_eventIsHidden(events[i].event_id))
            ret.push(events[i].event_id);
    return ret;
}
function EventsMan_getAllEventIDs()
{
    var ret = [];
    $.each(eventsManager.events, function(eventID, eventDict){
        if (EventsMan_showHidden() || !EventsMan_eventIsHidden(eventID))
            ret.push(eventID);
    });
    return ret;
}

function EventsMan_hasUncommitted(id)
{
    return id in eventsManager.uncommitted;
}
function EventsMan_getUncommitted(id)
{
    return eventsManager.uncommitted[id];
}

function EventsMan_addEvent()
{
    var id = String(-1 * ++eventsManager.addedCount);
    var firstSectionKey = 123;
    for (var key in SECTION_MAP)
    {
        firstSectionKey = key;
        break;
    }
    var eventDict = {
        event_id: id,
        event_group_id: id, // TODO safe? value won't be used.
        event_title: 'Event Name',
        event_type: 'AS',
        event_start: moment().unix(),
        event_end: moment().minute(moment().minute() + 50).unix(),
        event_description: 'Event description \n Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        event_location: 'Event location',
        // Add color for event
        course_id: -1,
        section_color: '#BE008A',
        section_id: firstSectionKey, 
        modified_user: USER_NETID,
        modified_time: moment().unix()
    }
    eventsManager.uncommitted[id] = eventDict;
    //eventsManager.order.push({event_id: id, event_start: eventDict.event_start});
    //eventsManager.order.sort(function(a,b){
    //    return parseInt(a.event_start) - parseInt(b.event_start);
    //});

    return id;
}

function EventsMan_deleteEvent(id, silent)
{
    silent = silent || false;
    if (id in eventsManager.events)
    {
        //eventsManager.events[id] = null;
        //delete eventsManager.events[id];
        //eventsManager.deletedIDs.push(id);
        eventsManager.hiddenIDs.add(id);
        eventsManager.changed = true;
    }
    if (id in eventsManager.uncommitted)
    {
        eventsManager.uncommitted[id] = null;
        delete eventsManager.uncommitted[id];
    }
    if (id in eventsManager.updatedIDs)
    {
        eventsManager.updatedIDs.remove(id);
    }
    if (!silent)
        _EventsMan_callUpdateListeners();
}
function EventsMan_deleteAllFutureEvents(id)
{
    var eventDict = EventsMan_getEventByID(id);
    var endDate = moment.unix(eventDict.event_start);
    endDate.year(endDate.year() + 20);
    var eventIDs = EventsMan_getEventIDForRange(eventDict.event_start, endDate.unix());
    $.each(eventIDs, function(index){
        var otherEventDict = EventsMan_getEventByID(this);
        if (otherEventDict.event_group_id == eventDict.event_group_id && otherEventDict != eventDict)
            EventsMan_deleteEvent(this, true);
    });
    EventsMan_deleteEvent(id);
}
function EventsMan_unhideEvent(id, silent)
{
    silent = silent || false;
    if (id in eventsManager.events)
    {
        //eventsManager.events[id] = null;
        //delete eventsManager.events[id];
        //eventsManager.deletedIDs.push(id);
        eventsManager.hiddenIDs.remove(id);
        eventsManager.changed = true;
    }
    if (!silent)
        _EventsMan_callUpdateListeners();
}
function EventsMan_unhideAllFutureEvents(id)
{
    var eventDict = EventsMan_getEventByID(id);
    var endDate = moment.unix(eventDict.event_start);
    endDate.year(endDate.year() + 20);
    var eventIDs = EventsMan_getEventIDForRange(eventDict.event_start, endDate.unix());
    $.each(eventIDs, function(index){
        var otherEventDict = EventsMan_getEventByID(this);
        if (otherEventDict.event_group_id == eventDict.event_group_id && otherEventDict != eventDict)
            EventsMan_unhideEvent(this, true);
    });
    EventsMan_unhideEvent(id);
}
function EventsMan_eventIsHidden(id)
{
    return id in eventsManager.hiddenIDs;
}
function EventsMan_eventShouldBeShown(id)
{
    return !EventsMan_eventIsHidden(id) || EventsMan_showHidden();
}

function EventsMan_ready()
{
    return EVENTS_READY;
}
function EventsMan_commitChanges(id)
{
    eventsManager.events[id] = eventsManager.uncommitted[id];
    delete eventsManager.uncommitted[id];
    eventsManager.updatedIDs.add(id);
    EventsMan_constructOrderArray();
    _EventsMan_callUpdateListeners();
}
function EventsMan_cancelChanges(id)
{
    delete eventsManager.uncommitted[id];
    _EventsMan_callUpdateListeners();
}
function EventsMan_commitChangesToAllFutureEvents(id)
{
    var newEventDict = eventsManager.uncommitted[id];
    var oldEventDict = eventsManager.events[id];
    var endDate = moment.unix(oldEventDict.event_start);
    endDate.year(endDate.year() + 20);
    var eventIDs = EventsMan_getEventIDForRange(oldEventDict.event_start, endDate.unix());
    var newStart = moment.unix(newEventDict.event_start);
    var newEnd = moment.unix(newEventDict.event_end);
    $.each(eventIDs, function(index){
        var otherEventDict = EventsMan_getEventByID(this);
        if (otherEventDict.event_group_id == oldEventDict.event_group_id && otherEventDict != oldEventDict)
        {
            otherEventDict.event_title = newEventDict.event_title;
            otherEventDict.event_description = newEventDict.event_description;
            otherEventDict.event_location = newEventDict.event_location;
            otherEventDict.section_id = newEventDict.section_id;
            otherEventDict.event_type = newEventDict.event_type;
            otherEventDict.modified_time = newEventDict.modified_time;
            otherEventDict.modified_user = newEventDict.modified_user;
            var start = moment.unix(otherEventDict.event_start).hour(newStart.hour());
            start.minute(newStart.minute());
            start.second(newStart.second());
            otherEventDict.event_start = start.unix();
            var end = moment.unix(otherEventDict.event_end).hour(newEnd.hour());
            end.minute(newEnd.minute());
            end.second(newEnd.second());
            otherEventDict.event_end = end.unix();
            eventsManager.updatedIDs.add(otherEventDict.event_id);
        }
    });
    EventsMan_commitChanges(id);
}
// replaces only in the uncommitted array - ok because we're only
// doing this for new events
function EventsMan_replaceUncommittedEventIDWithEvent(id, eventDict)
{
    eventsManager.uncommitted[id] = null;
    delete eventsManager.uncommitted[id];
    eventsManager.uncommitted[eventDict.event_id] = eventDict;
    EventsMan_callEventIDsChangeListener(id, eventDict.event_id);
    _EventsMan_callUpdateListeners();
}
function EventsMan_replaceEventIDWithEvent(id, eventDict)
{
    // first replace it in the main events array
    eventsManager.events[id] = null;
    delete eventsManager.events[id];
    eventsManager.events[eventDict.event_id] = eventDict;
    if (EventsMan_hasUncommitted(id))
    {
        delete eventsManager.uncommitted[id];
    }
    EventsMan_callEventIDsChangeListener(id, eventDict.event_id);
    _EventsMan_callUpdateListeners();
}
/***************************************************
 * Server code
 **************************************************/
function EventsMan_pushToServer(async){};
function EventsMan_pullFromServer(complete){};

/***************************************************
 * Client Event Listeners
 **************************************************/

function _EventsMan_callUpdateListeners()
{
    $.each(EventsMan_updateListeners, function(index) {
        this();
    });
}
function EventsMan_addUpdateListener(listener)
{
    EventsMan_updateListeners.push(listener);
}

// if already ready, calls right away
function EventsMan_addOnReadyListener(listener)
{
    if (EVENTS_READY)
    {
        listener();
        return;
    }
    EventsMan_onReadyListeners.push(listener);
}
function EventsMan_callOnReadyListeners()
{
    $.each(EventsMan_onReadyListeners, function(index){
        this();
    });
    EventsMan_onReadyListeners = null;
}
function EventsMan_addEventIDsChangeListener(listener)
{
    EventsMan_eventIDsChangeListener.push(listener);
}
function EventsMan_callEventIDsChangeListener(oldID, newID)
{
    $.each(EventsMan_eventIDsChangeListener, function(index){
        this(oldID, newID);
    });
}
/***************************************************
 * Miscellaneous
 **************************************************/

function EventsMan_cloneEventDict(eventDict)
{
    var newDict = JSON.parse(JSON.stringify(eventDict)) // hack for cloning
    return newDict;
}

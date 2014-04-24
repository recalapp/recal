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
    this.deletedIDs = [];
    this.updatedIDs = new Set(); // if it is in updatedIDs, it'll be pushed on the next connection
    this.uncommitted = {}; // copies of events dict with uncommitted changes, once saved, the event dict is copied to eventsManager.events, and its ID is added to updatedIDs
    this.isIdle = true;
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
    var ret = eventsManager.order.slice(iStart, iEnd);
    for (var i = 0; i < ret.length; i++)
        ret[i] = ret[i].event_id;
    return ret;
}
function EventsMan_getAllEventIDs()
{
    var ret = [];
    $.each(eventsManager.events, function(eventID, eventDict){
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

    var eventDict = {
        event_id: id,
        event_group_id: id, // TODO safe? value won't be used.
        event_title: 'Event Name',
        event_type: 'AS',
        event_start: moment().unix(),
        event_end: moment().minute(moment().minute() + 50).unix(),
        event_description: 'Event description \n Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        event_location: 'Event location',
        section_id: SP_firstSectionKey(), 
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

function EventsMan_deleteEvent(id)
{
    if (id in eventsManager.events)
    {
        eventsManager.events[id] = null;
        delete eventsManager.events[id];
        //var dIndex = null;
        //$.each(eventsManager.order, function(index){
        //    if (this.event_id == id)
        //    {
        //        dIndex = index;
        //        return false;
        //    }
        //});
        //eventsManager.order.splice(dIndex, 1);
        eventsManager.deletedIDs.push(id);
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
    _EventsMan_callUpdateListeners();
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

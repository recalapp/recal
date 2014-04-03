var eventsManager = null;
var EVENTS_INIT = false;

function EventsMan_init()
{
    if (EVENTS_INIT)
        return;
    EVENTS_INIT = true;
    eventsManager = new _EventsMan_new();
    // TODO should populate events manager
}

function _EventsMan_new()
{
    this.events = {};
    this.order = []; // {start: "start", id: "id"}, keep sorted
    this.lastSyncedTime = null; // will be set when populating
    this.addedCount = 0;
    this.deletedIDs = [];
    return this;
}

/**************************************************
 * Client methods
 * These are strictly interactions between the event
 * manager and the client. It does NOT talk to 
 * the server.
 **************************************************/

//{
//    id: "id",
//    title: "title",
//    type: "type",
//    description: "description",
//    start: "start unix time",
//    end: "end unix time",
//    loc: "location",
//    recurring: // how??
//    updatedTime: // from server
//}
function EventsMan_getEventByID(id)
{
    return this.events[id];
}

function EventsMan_getEventIDForRange(start, end)
{
    var index = 0;
    while (eventsManager.order[i].start < start)
        i++;
    var iStart = i;
    while (eventsManager.order[i].start <= end)
        i++;
    var iEnd = ++i; // slice method is exclusive on the right end
    var ret = eventsManager.order.slice(iStart, iEnd);
    for (var i = 0; i < ret.length; i++)
        ret[i] = ret[i].id;
    return ret;
}
function EventsMan_updateEventForID(id, eventDict)
{
    // TODO should verify eventDict
    eventsManager.events[id] = eventDict;
    eventDict.updatedTime = new Date().getTime();
}
function EventsMan_addEventForID(eventDict)
{
    // TODO should verify eventDict
    eventsManager.events[-1 * ++this.addedCount] = eventDict;
    // TODO contact the server for new id asynchronously, set the ID
    // when get reply
    eventDict.updatedTime = new Date().getTime();
    // TODO handle new events, maybe set ID = -1?
}
function EventsMan_deleteEvent(id)
{
    delete eventsManager.events[id];
    eventsManager.deletedIDs.push(id);
}

/***************************************************
 * Server code
 * Logic: when downloading from server, set updatedTime
 * to be the timestamp when downloading. When an update occurs
 * on a particular event, set the updated time again. When
 * calling update, filter out the items that have updated time larger
 * than the manager's last updated time, then if successful,
 * set the last updated time.
 *
 * timestamp: new Date().getTime();
 *
 * TODO decide if i need a sync button
 **************************************************/

function EventsMan_pushToServer()
{
    updated = $(eventsManager.events).filter(function (){
        return this.updatedTime > eventsManager.lastSyncedTime;
    });
    deleted = eventsManager.deletedIDs;
    // TODO call update on server, then when done, reload the data
    var newSyncedTime = new Date().getTime(); // only set this if successful
    // TODO set addedcount to 0
}

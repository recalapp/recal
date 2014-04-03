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
    // TODO contact server
}
function EventsMan_addEventForID(id, eventDict)
{
    // TODO should verify eventDict
    eventsManager.events[id] = eventDict;
    // TODO contact server
}
function EventsMan_deleteEvent(id)
{
    delete eventsManager.events[id];
    // TODO contact server
}

/***************************************************
 * Server code
 **************************************************/

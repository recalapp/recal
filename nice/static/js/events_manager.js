var eventsManager = null;
var EventsMan_updateListeners = [];
var EventsMan_onReadyListeners = [];
var EventsMan_eventIDsChangeListener = [];
var EVENTS_INIT = false;
var EVENTS_READY = false;

function EventsMan_init()
{
    if (EVENTS_INIT)
        return;
    EVENTS_INIT = true;
    eventsManager = new _EventsMan_new();
    EventsMan_pullFromServer(function() {
        EVENTS_READY = true;
        EventsMan_callOnReadyListeners();
    });
    PopUp_addEditListener(function(id, field, value) {
        if (field == 'event_type')
            eventsManager.events[id][field] = TP_textToKey(value);
        else if (field == 'section_id')
            eventsManager.events[id][field] = SP_textToKey(value);
        else if (field == 'event_date')
        {
            var eventDict = eventsManager.events[id];
            var startDate = moment.unix(eventDict.event_start);
            var endDate = moment.unix(eventDict.event_end);
            var newDate = moment(value);
            startDate.year(newDate.year());
            startDate.month(newDate.month());
            startDate.date(newDate.date());
            endDate.year(newDate.year());
            endDate.month(newDate.month());
            endDate.date(newDate.date());
            eventDict.event_start = startDate.unix();
            eventDict.event_end = endDate.unix();
            $.each(eventsManager.order, function(index) {
                if (this.event_id == eventDict.event_id)
                {
                    this.event_start = eventDict.event_start;
                }
            });
            eventsManager.order.sort(function(a,b){
                return parseInt(a.event_start) - parseInt(b.event_start);
            });
        }
        else if (field == 'event_start' || field == 'event_end')
        {
            value = 'April 25, 2014 ' + value; // gives a dummy date to satisfy moment.js
            var eventDict = eventsManager.events[id];
            var oldTime = moment.unix(eventDict[field]);
            var newTime = moment(value);
            oldTime.hour(newTime.hour());
            oldTime.minute(newTime.minute());
            eventDict[field] = oldTime.unix();
            $.each(eventsManager.order, function(index) {
                if (this.event_id == eventDict.event_id)
                {
                    this.event_start = eventDict.event_start;
                }
            });
            eventsManager.order.sort(function(a,b){
                return parseInt(a.event_start) - parseInt(b.event_start);
            });
        }
        else
            eventsManager.events[id][field] = value;
        eventsManager.events[id].modified_time = moment().unix()
        _EventsMan_callUpdateListeners()
    });

    $(window).on('beforeunload', function() {
        EventsMan_pushToServer(false);
    });

    window.setInterval("EventsMan_pushToServer(true); EventsMan_pullFromServer();", 10 * 1000);
}

function _EventsMan_new()
{
    this.events = {};
    this.order = []; // {start: "start", id: "id"}, keep sorted
    this.lastSyncedTime = 0; // will be set when populating
    this.addedCount = 0;
    this.deletedIDs = [];
    this.isIdle = true;
    return this;
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

function EventsMan_getEventIDForRange(start, end)
{
    var i = 0;
    while (i < eventsManager.order.length && eventsManager.order[i].event_start < start)
        i++;
    var iStart = i;
    while (i < eventsManager.order.length && eventsManager.order[i].event_start <= end)
        i++;
    var iEnd = Math.min(++i, eventsManager.order.length); // slice method is exclusive on the right end
    var ret = eventsManager.order.slice(iStart, iEnd);
    for (var i = 0; i < ret.length; i++)
        ret[i] = ret[i].event_id;
    return ret;
}

function EventsMan_addEvent()
{
    var id = String(-1 * ++eventsManager.addedCount);

    var eventDict = {
        event_id: id,
        event_group_id: id, // TODO safe? value won't be used.
        event_title: 'New event',
        event_type: 'AS',
        event_start: moment().unix(),
        event_end: moment().minute(moment().minute() + 50).unix(),
        event_description: 'Event description',
        event_location: 'Event location',
        section_id: SP_firstSectionKey(), 
        modified_user: USER_NETID,
        modified_time: moment().unix()
    }
    eventsManager.events[id] = eventDict;
    eventsManager.order.push({event_id: id, event_start: eventDict.event_start});
    eventsManager.order.sort(function(a,b){
        return parseInt(a.event_start) - parseInt(b.event_start);
    });

    return id;
}

function EventsMan_deleteEvent(id)
{
    eventsManager.events[id] = null;
    delete eventsManager.events[id];
    var dIndex = null;
    $.each(eventsManager.order, function(index){
        if (this.event_id == id)
        {
            dIndex = index;
            return false;
        }
    });
    eventsManager.order.splice(dIndex, 1);
    eventsManager.deletedIDs.push(id);
    _EventsMan_callUpdateListeners();
}

function EventsMan_ready()
{
    return EVENTS_READY;
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

function EventsMan_pushToServer(async)
{
    if (!eventsManager.isIdle)
        return;
    eventsManager.isIdle = false;
    var updated = [];
    $.each(eventsManager.events, function(id, eventDict){
        if (eventDict.modified_time > eventsManager.lastSyncedTime)
            updated.push(eventDict);
    });
    var deleted = eventsManager.deletedIDs;
    if (updated.length > 0 || deleted.length > 0)
    {
        $.ajax('put', {
            dataType: 'json',
            type: 'POST',
            data: {
                events: JSON.stringify(updated),
                hide: JSON.stringify(deleted)
            },
            success: function(data){
                $.each(data, function(oldID, newID){
                    var eventDict = eventsManager.events[oldID];
                    delete eventsManager.events[oldID];
                    eventDict.event_id = newID;
                    eventsManager.events[newID] = eventDict;
                    $.each(eventsManager.order, function(index){
                        if (this.event_id == oldID)
                        {
                            this.event_id = newID;
                            return false;
                        }
                    });
                    EventsMan_callEventIDsChangeListener(oldID, newID);
                });
                eventsManager.isIdle = true;
                eventsManager.addedCount = 0;
                eventsManager.deletedIDs = [];

                EventsMan_pullFromServer();
            },
            async: async,
        });
    } else {
        eventsManager.isIdle = true;
    }
}
function EventsMan_pullFromServer(complete)
{
    if (!eventsManager.isIdle)
        return;
    eventsManager.isIdle = false;
    $.ajax('get/' + eventsManager.lastSyncedTime, {
        dataType: 'json',
        success: function(data){
            //var eventsArray = JSON.parse(data);
            var eventsArray = data;
            for (var i = 0; i < eventsArray.length; i++)
            {
                var eventsDict = eventsArray[i];
                eventsManager.events[eventsDict.event_id] = eventsDict;

                eventsManager.order.push({'event_start': eventsDict.event_start, 'event_id': eventsDict.event_id});
            }
            eventsManager.order = [];
            $.each(eventsManager.events, function(key, eventDict){
                eventsManager.order.push({'event_start': eventDict.event_start, 'event_id': key}); 
            });
            eventsManager.order.sort(function(a,b){
                return parseInt(a.event_start) - parseInt(b.event_start);
            });
            eventsManager.addedCount = 0;
            eventsManager.lastSyncedTime = moment().unix();

            eventsManager.isIdle = true;

            if (complete != null)
                complete();
            _EventsMan_callUpdateListeners();
        }
    });
}


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
 * Event Listeners
 **************************************************/

function EventsMan_clickAddEvent()
{
    var popUp = PopUp_getMainPopUp();
    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));

    // set new ID
    var id = EventsMan_addEvent();
    PopUp_setToEventID(popUp, id);
    
    // request server for new id
    PopUp_giveFocus(popUp);
    _EventsMan_callUpdateListeners();
}

function EventsMan_clickSync()
{
    EventsMan_pushToServer();
    SR_save();
    //var $syncButton = $('#sync-button').find('span');
    //$syncButton.addClass('icon-refresh-animate')
}

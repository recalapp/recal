var timeoutIDs = [];
var EVENTSMAN_COUNT = 0;
function EventsMan_init()
{
    if (EVENTS_INIT)
        return;
    EVENTS_INIT = true;
    eventsManager = new _EventsMan_new();

    // try to load from local storage. If it exists, use it, otherwise,
    // load from server and show loading indicator
    if (EventsMan_load())
    {
        EVENTS_READY = true;
        EventsMan_callOnReadyListeners();
        _EventsMan_callUpdateListeners();
        EventsMan_verifyLocalData();
    }
    else
    {
        EventsMan_pullFromServer(function() {
            EVENTS_READY = true;
            EventsMan_callOnReadyListeners();
        }, true);
    }

    // this gets called whenever the user edits an event
    PopUp_addEditListener(function(id, field, value) {
        if (field == 'event_type')
        {
            value = TYPE_MAP_INVERSE[value.toLowerCase()];
            if (id in eventsManager.events && eventsManager.events[id][field] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            eventsManager.uncommitted[id][field] = value;
        }
        else if (field == 'section_id')
        {
            value = SECTION_MAP_INVERSE[value.toLowerCase()];
            if (id in eventsManager.events && eventsManager.events[id][field] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            eventsManager.uncommitted[id][field] = value;
        }
        else if (field == 'event_date')
        {
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            var eventDict = eventsManager.uncommitted[id];
            var startDate = moment.unix(eventDict.event_start);
            var endDate = moment.unix(eventDict.event_end);
            var newDate = moment(value);
            if (id in eventsManager.events && newDate.date() == startDate.date() && newDate.month() == startDate.month() && newDate.year() == startDate.year())
                return;
            startDate.year(newDate.year());
            startDate.month(newDate.month());
            startDate.date(newDate.date());
            endDate.year(newDate.year());
            endDate.month(newDate.month());
            endDate.date(newDate.date());
            eventDict.event_start = startDate.unix();
            eventDict.event_end = endDate.unix();
        }
        else if (field == 'event_start' || field == 'event_end')
        {
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id]);
            value = 'April 25, 2014 ' + value; // gives a dummy date to satisfy moment.js
            var eventDict = eventsManager.uncommitted[id];
            var oldTime = moment.unix(eventDict[field]);
            var newTime = moment(value);
            if (id in eventsManager.events && oldTime.minute() == newTime.minute() && oldTime.hour() == newTime.hour())
                return; // TODO this creates a new revision even if no changes were made
            oldTime.hour(newTime.hour());
            oldTime.minute(newTime.minute());
            eventDict[field] = oldTime.unix();
        }
        else if (field == 'event_recurrence')
        {
            if (value)
            {
                // TODO figure out how to get last day of class (not the same as last day of semester - reading period, etc.)
                if (id in eventsManager.events 
                    && 'recurrence_days' in eventsManager.events[id]
                    && eventsManager.events[id].recurrence_days.equals(value))
                    return; // no change
                if (!(id in eventsManager.uncommitted))
                    eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id]);
                var eventDict = eventsManager.uncommitted[id];

                var start = moment.unix(eventDict.event_start);
                var day = (start.tz(MAIN_TIMEZONE).day() - 1) % 7;

                if (!value.contains(day))
                    value.push(day);
                value.sort();
                eventDict['recurrence_days'] = value;
                if (!('recurrence_interval' in eventDict))
                    eventDict['recurrence_interval'] = 1;
                if (!('recurrence_end' in eventDict))
                    eventDict['recurrence_end'] = parseInt(CUR_SEM.end_date);
            }
            else 
            {
                // delete recurrence
                if (id in eventsManager.events
                    && !('recurrence_days' in eventsManager.events[id]))
                    return; // no change
                if (!(id in eventsManager.uncommitted))
                    eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id]);
                var eventDict = eventsManager.uncommitted[id];

                delete eventDict['recurrence_days'];
                delete eventDict['recurrence_end'];
                delete eventDict['recurrence_interval'];
            }
        }
        else if (false && field == 'event_recurrence_interval')
        {
            if (id in eventsManager.events && eventsManager.events[id]['reccurrence_interval'] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id]);
            var eventDict = eventsManager.uncommitted[id];
            eventDict['reccurence_interval'] = value;
        }
        else
        {
            if (id in eventsManager.events && eventsManager.events[id][field] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            eventsManager.uncommitted[id][field] = value;
        }
        eventsManager.uncommitted[id].modified_time = moment().unix()
        if (!(id in eventsManager.events)) // new event
        {
            // display notifications if similar events exist.
            SE_checkSimilarEvents(eventsManager.uncommitted[id]);
        }
        _EventsMan_callUpdateListeners()
    });

    $(window).on('beforeunload', function(ev) {
        // first check if the user has uncommitted changes
        if (Object.getOwnPropertyNames(eventsManager.uncommitted).length > 0)
        {
            ev.preventDefault()
            return 'Your changes have not been saved. Are you sure you want to leave?';
        }
        // push committed any changes (the user thinks it's already pushed)
        EventsMan_pushToServer(false);
        // save events in local storage
        EventsMan_save();
    });

    // verify local data every 4.5 min if the user is active (10 if not active).
    RF_addRecurringFunction(function(){
        EventsMan_verifyLocalData();
    }, 4.5 * 60 * 1000, 10 * 60 * 1000);
    // push/pull every 10 seconds if the user is active (5 min if not active).
    RF_addRecurringFunction(function(){
        EventsMan_pushToServer(true); 
        EventsMan_pullFromServer();
    }, 10 * 1000, 60 * 5 * 1000);
}

/***************************************************
 * Server code
 **************************************************/

function EventsMan_pushToServer(async)
{
    if (!eventsManager.isIdle)
        return;
    eventsManager.isIdle = false;
    var updated = [];
    $.each(eventsManager.updatedIDs.toArray(), function(index){
        updated.push(eventsManager.events[this]);
    });
    // check if there are any changes to be pushed
    if (updated.length > 0 || eventsManager.changed)
    {
        $.ajax('/put', {
            dataType: 'json',
            type: 'POST',
            data: {
                events: JSON.stringify(updated),
                hidden: JSON.stringify(eventsManager.hiddenIDs.toArray())
            },
            success: function(data){
                var changedIDs = data.changed_ids;
                $.each(changedIDs, function(oldID, idArray){
                    // handle eventIDs changes
                    var newID = idArray[0];
                    var newGroupID = idArray[1];
                    if (oldID in eventsManager.events) {
                        var eventDict = eventsManager.events[oldID];
                        delete eventsManager.events[oldID];
                        eventDict.event_id = newID;
                        eventDict.event_group_id = newGroupID;
                        eventsManager.events[newID] = eventDict;
                    }
                    if (oldID in eventsManager.uncommitted) {
                        var eventDict = eventsManager.uncommitted[oldID];
                        delete eventsManager.uncommitted[oldID];
                        eventDict.event_id = newID;
                        eventDict.event_group_id = newGroupID;
                        eventsManager.uncommitted[newID] = eventDict;
                    }
                    EventsMan_callEventIDsChangeListener(oldID, newID);
                });

                // events have changed. Construct a new order array
                EventsMan_constructOrderArray();

                // now check for event IDs that have since been deleted
                // this is mostly for recurring events
                var deletedIDs = data.deleted_ids;
                var haveDeletedID = false;
                $.each(deletedIDs, function(index){
                    if (this in eventsManager.events) {
                        delete eventsManager.events[this];
                        haveDeletedID = true;
                    }
                    if (this in eventsManager.uncommitted){
                        delete eventsManager.uncommitted[this];
                        haveDeletedID = true;
                    }
                });
                if (haveDeletedID)
                    _EventsMan_callUpdateListeners();

                // reset the state of the events manager, then pull
                eventsManager.isIdle = true;
                eventsManager.updatedIDs = new Set();
                eventsManager.changed = false;
                EventsMan_pullFromServer(null, true);
            },
            async: async,
            error: function(data){
                eventsManager.isIdle = true;
            },
        });
    } else {
        eventsManager.isIdle = true;
    }
}
function EventsMan_pullFromServer(complete, showLoading)
{
    if (!eventsManager.isIdle)
        return;
    if (eventsManager.updatedIDs.size > 0 || eventsManager.changed)
        return; // don't pull until changes are pushed
    showLoading = typeof showLoading != 'undefined' ? showLoading : false; // default value = false
    eventsManager.isIdle = false;
    var url = '/get/' + eventsManager.lastSyncedTime;
    $.ajax(url, {
        dataType: 'json',
        loadingIndicator: showLoading,
        loadingID: '/get',
        success: function(data){
            var changed = EventsMan_processDownloadedEvents(data);

            eventsManager.isIdle = true;

            if (complete != null)
                complete();
            if (changed)
                _EventsMan_callUpdateListeners();
        },
        error: function(data){
            eventsManager.isIdle = true;
            LO_showError('/get');
        },
    });
}

/**
 * process data downloaded from pull. Return a boolean
 * indicating whether the events manager has changed in
 * any way (so that update listeners can be notified)
 */
function EventsMan_processDownloadedEvents(data)
{
    var changed = false;
    var eventsArray = data.events;
    // go through the array of events
    for (var i = 0; i < eventsArray.length; i++)
    {
        var eventsDict = eventsArray[i];
        if (eventsDict.event_id in eventsManager.uncommitted)
        {
            // TODO notify user of updates
        }
        if (eventsDict.event_id in eventsManager.updatedIDs)
        {
            // TODO don't do anything?
        }
        else {
            eventsManager.events[eventsDict.event_id] = eventsDict;
        }
        changed = true;
    }

    // handle hidden events
    var hiddenIDs = Set.prototype.fromArray(data.hidden_events);
    if (!hiddenIDs.equals(eventsManager.hiddenIDs) && !eventsManager.changed)
    {
        eventsManager.hiddenIDs = hiddenIDs; // NOTE ok, since we don't pull until all changes are pushed
        changed = true;
    }

    // events have changed. reconstruct order array
    EventsMan_constructOrderArray();
    eventsManager.addedCount = 0;
    eventsManager.lastSyncedTime = moment().unix();
    return changed;
}

/**
 * Verify local storage. In this implementation, just pull
 * everything again
 */
function EventsMan_verifyLocalData()
{
    eventsManager.lastSyncedTime = 0;
    EventsMan_pullFromServer();
}

/***************************************************
 * Event Listeners
 **************************************************/

/**
 * called when user click on the add event button
 */
function EventsMan_clickAddEvent()
{
    var popUp = PopUp_getMainPopUp();
    if (PopUp_getID(popUp))
        PopUp_callCloseListeners(PopUp_getID(popUp));

    // set new ID
    var id = EventsMan_addEvent();
    var success = PopUp_setToEventID(popUp, id);
    if (!success)
    {
        EventsMan_cancelChanges(id);
        return;
    }
    PopUp_markAsUnsaved(popUp);
    
    PopUp_giveFocus(popUp);
    PopUp_giveEditingFocus(popUp);
}

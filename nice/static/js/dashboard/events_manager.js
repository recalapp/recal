
function EventsMan_init()
{
    if (EVENTS_INIT)
        return;
    EVENTS_INIT = true;
    eventsManager = new _EventsMan_new();
    EventsMan_pullFromServer(function() {
        EVENTS_READY = true;
        EventsMan_callOnReadyListeners();
    }, true);
    PopUp_addEditListener(function(id, field, value) {
        if (field == 'event_type')
        {
            value = TP_textToKey(value);
            if (id in eventsManager.events && eventsManager.events[id][field] == value)
                return;
            if (!(id in eventsManager.uncommitted))
                eventsManager.uncommitted[id] = EventsMan_cloneEventDict(eventsManager.events[id])
            eventsManager.uncommitted[id][field] = value;
        }
        else if (field == 'section_id')
        {
            value = SP_textToKey(value);
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

                value.sort();
                eventDict['recurrence_days'] = value;
                eventDict['recurrence_interval'] = 1;
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
            $.post('get/similar-events', {
                event_dict: JSON.stringify(eventsManager.uncommitted[id]), 
            }, function (data){
                NO_showSimilarEventsNotification(id, data);
            }, 'json')
        }
        _EventsMan_callUpdateListeners()
    });

    $(window).on('beforeunload', function(ev) {
        if (Object.getOwnPropertyNames(eventsManager.uncommitted).length > 0)
        {
            ev.preventDefault()
            return 'Your changes have not been saved. Are you sure you want to leave?';
        }
        EventsMan_pushToServer(false);
    });

    window.setInterval("EventsMan_pushToServer(true); EventsMan_pullFromServer();", 10 * 1000);
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
   
    //var deleted = eventsManager.deletedIDs;
    if (updated.length > 0 || eventsManager.changed)
    {
        LO_show();
        $.ajax('put', {
            dataType: 'json',
            type: 'POST',
            data: {
                events: JSON.stringify(updated),
                hidden: JSON.stringify(eventsManager.hiddenIDs.toArray())
            },
            success: function(data){
                var changedIDs = data.changed_ids;
                $.each(changedIDs, function(oldID, idArray){
                    var newID = idArray[0];
                    var newGroupID = idArray[1];
                    if (oldID in eventsManager.events) {
                        var eventDict = eventsManager.events[oldID];
                        delete eventsManager.events[oldID];
                        eventDict.event_id = newID;
                        eventDict.event_group_id = newGroupID;
                        eventsManager.events[newID] = eventDict;
                    }
                    //$.each(eventsManager.order, function(index){
                    //    if (this.event_id == oldID)
                    //    {
                    //        this.event_id = newID;
                    //        return false;
                    //    }
                    //});
                    if (oldID in eventsManager.uncommitted) {
                        var eventDict = eventsManager.uncommitted[oldID];
                        delete eventsManager.uncommitted[oldID];
                        eventDict.event_id = newID;
                        eventDict.event_group_id = newGroupID;
                        eventsManager.uncommitted[newID] = eventDict;
                    }
                    EventsMan_callEventIDsChangeListener(oldID, newID);
                });
                EventsMan_constructOrderArray();
                var deletedIDs = data.deleted_ids;
                $.each(deletedIDs, function(index){
                    // TODO what if the id was already opened? this code doesn't handle that
                    if (this in eventsManager.events) {
                        delete eventsManager.events[this];
                    }
                    if (this in eventsManager.uncommitted){
                        delete eventsManager.uncommitted[this];
                    }
                });
                eventsManager.isIdle = true;
                LO_hide();
                //eventsManager.addedCount = 0; // not gonna overflow, no need to set to 0. Safer, so IDs don't ever crash
                //eventsManager.deletedIDs = [];
                eventsManager.updatedIDs = new Set();
                eventsManager.changed = false;

                EventsMan_pullFromServer();
            },
            async: async,
            error: function(data){
                eventsManager.isIdle = true;
                LO_hide();
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
    showLoading = typeof showLoading != 'undefined' ? showLoading : false;
    if (showLoading)
        LO_show();
    eventsManager.isIdle = false;
    $.ajax('get/' + eventsManager.lastSyncedTime, {
        dataType: 'json',
        success: function(data){
            //var eventsArray = JSON.parse(data);
            var changed = false;
            var eventsArray = data.events;
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
            var hiddenIDs = Set.prototype.fromArray(data.hidden_events);
            if (!hiddenIDs.equals(eventsManager.hiddenIDs) && !eventsManager.changed)
            {
                eventsManager.hiddenIDs = hiddenIDs; // NOTE ok, since we don't pull until all changes are pushed
                changed = true;
            }
            EventsMan_constructOrderArray();
            eventsManager.addedCount = 0;
            eventsManager.lastSyncedTime = moment().unix();

            eventsManager.isIdle = true;
            LO_hide();

            if (complete != null)
                complete();
            if (changed)
                _EventsMan_callUpdateListeners();
        },
        error: function(data){
            eventsManager.isIdle = true;
            LO_hide();
        },
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
    PopUp_markAsUnsaved(popUp);
    
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

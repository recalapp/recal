/***************************************************
 * Similar Events Module
 **************************************************/
function SE_checkSimilarEvents(eventDict)
{
    if (SE_hasSimilarEvents(eventDict.event_id) || SB_isFilled())
        return;
    $.ajax('/get/similar-events', {
        data: {
            event_dict: JSON.stringify(eventDict),
        },
        dataType: 'json',
        type: 'POST',
        loadingIndicator: false,
        success: function(data){
            if (data.length > 0)
                SE_showSimilarEventsNotification(eventDict.event_id, data);
        },
    });
}
function SE_showSimilarEventsNotification(eventID, similarEvents)
{
    var count = similarEvents.length;
    var text;
    if (count == 1)
    {
        text = "Found 1 similar event. Click here to view it first."
    }
    else
    {
        text = "Found " + count + " similar events. Click here to view them first."
    }
    var $noti = NO_showNotification(eventID, text, NO_TYPES.WARNING, null);
    $noti.on('noti.click', function(ev){
        SE_showSimilarEvents(eventID, similarEvents);
    });
}
function SE_hasSimilarEvents(eventID)
{
    return NO_hasNotificationID(eventID);
}
function SE_showSimilarEvents(eventID, similarEvents)
{
    var choices = [];
    $.each(similarEvents, function(index, eventDict){
        choices.push({
            eventID: eventID,
            eventDict: eventDict,
            buttons: [
                {
                    value: 'c',
                    pretty: 'Choose',
                }
            ],
        });
    });
    var ep = EP_init('Is this the same as your event?', choices);
    SB_setMainContent(ep);
    SB_fill();

    // set the left hand component of the side bar
    var popUp = PopUp_getPopUpByID(eventID)
    PopUp_markAsEditing(popUp);
    if (PopUp_hasMain() && !PopUp_isMain(popUp))
    {
        var main = PopUp_getMainPopUp();
        PopUp_callCloseListeners(PopUp_getID(main));
        $(main).remove();
    }
    SB_push(popUp);
    PopUp_updateSize(popUp);
    PopUp_makeMain(popUp);
    $(popUp).draggable('disable');


    // set event listeners
    $(ep).on('ep.cancel ep.select', function(ev){
        PopUp_markAsNotEditing(popUp);
        $(popUp).draggable('enable');
        SB_pop(this);
        SB_unfill();
    });
    $(ep).on('ep.select', function(ev, meta){
        EventsMan_replaceEventIDWithEvent(meta.eventID, meta.eventDict);
    });
}

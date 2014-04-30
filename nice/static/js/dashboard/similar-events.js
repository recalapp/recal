function SE_checkSimilarEvents(eventDict)
{
    $.post('/get/similar-events', {
        event_dict: JSON.stringify(eventDict),
    }, function(data){
        if (data.length > 0)
            SE_showSimilarEventsNotification(eventDict.event_id, data);
    }, 'json');
}
function SE_showSimilarEventsNotification(eventID, similarEvents)
{
    var $noti = NO_showNotification(eventID, 'A similar event already exists', NO_TYPES.WARNING, null);
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
    // TODO doesn't handle if the user clicks on the hide sidebar button
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

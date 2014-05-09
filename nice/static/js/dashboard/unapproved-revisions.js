function UR_pullUnapprovedRevisions()
{
    if (UR_hasUnapprovedRevisions() || SB_isFilled())
        return;
    $.ajax('/get/unapproved', {
        async: true,
        dataType: 'json',
        loadingIndicator: false,
        success: function(data){
            if (data && data.length > 0)
            {
                var $noti = NO_showNotification('unapproved-rev', 'There are unapproved changes', NO_TYPES.INFO, null);
                $noti.on('noti.click', function(ev){
                    UR_showUnapprovedRevisions(data);
                });
            }
        },
    });
}

function UR_hasUnapprovedRevisions()
{
    return NO_hasNotificationID('unapproved-rev');
}

function UR_showUnapprovedRevisions(unapprovedRevs)
{
    var choices = [];
    $.each(unapprovedRevs, function(index, revDict){
        choices.push({
            eventID: revDict.event_id,
            eventDict: revDict,
            buttons: [
                {
                    value: 'up',
                    pretty: '<span class="glyphicon glyphicon-thumbs-up"></span>',
                },
                {
                    value: 'down',
                    pretty: '<span class="glyphicon glyphicon-thumbs-down"></span>',
                },
            ],
        });
    });
    var ep = EP_init('Does this change look correct?', choices);
    SB_setMainContent(ep);
    SB_fill();
    EP_adjustPopUpSize(ep);

    // set the left hand component of the side bar
    UR_updateLeft(0, unapprovedRevs);
    
    // set event listeners
    $(ep).on('ep.cancel', function(ev){
        UR_close(this);
    });
    $(ep).on('ep.select', function(ev, meta){
        $.ajax('/put/votes', {
            data: {
                    'votes': JSON.stringify([
                        {
                            is_positive: meta.button == 'up',
                            revision_id: parseInt(meta.eventDict.revision_id),
                        }
                    ]),
                },
            type: 'POST',
            success: function(data){
                updatePoints();
            }
        });
        if (unapprovedRevs.length == 1)
        {
            UR_close(this);
        }
        else
        {
            EP_removeItemAtIndex(ep, meta.index);
            unapprovedRevs.splice(meta.index, 1); // remove item from array as well
        }
    });
    $(ep).on('ep.slid', function(ev, meta){
        UR_updateLeft(meta.index, unapprovedRevs);
    });
}

function UR_updateLeft(index, unapprovedRevs)
{
    if (EventsMan_hasEvent(unapprovedRevs[index].event_id))
    {
        var mainPopUp = PopUp_getMainPopUp();
        PopUp_setToEventID(mainPopUp, unapprovedRevs[index].event_id);
        $(mainPopUp).draggable('disable');
    }
    else
    {
        if (PopUp_hasMain())
        {
            var mainPopUp = PopUp_getMainPopUp();
            PopUp_close(mainPopUp);
        }
        //SB_pop(mainPopUp);
    }
}
function UR_close(ep)
{
    var mainPopUp = PopUp_getMainPopUp();
    PopUp_close(mainPopUp);
    SB_pop(ep);
    SB_unfill();
    SB_hide();
    LO_showTemporaryMessage('Thanks for voting!', LO_TYPES.SUCCESS);
    EventsMan_verifyLocalStorage();
}

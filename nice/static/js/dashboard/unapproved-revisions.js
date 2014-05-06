function UR_pullUnapprovedRevisions()
{
    $.ajax('/get/unapproved', {
        async: true,
        dataType: 'json',
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

    // set the left hand component of the side bar
    UR_updateLeft(0, unapprovedRevs);
    
    // set event listeners
    $(ep).on('ep.cancel', function(ev){
        var mainPopUp = PopUp_getMainPopUp();
        PopUp_close(mainPopUp);
        SB_pop(this);
        SB_unfill();
        SB_hide();
    });
    $(ep).on('ep.select', function(ev, meta){
        if (meta.button == 'up')
        {
        }
        else
        {
        }
        EP_removeItemAtIndex(ep, index);
    });
    $(ep).on('ep.slid', function(ev, meta){
        UR_updateLeft(meta.index, unapprovedRevs);
    });
}

function UR_updateLeft(index, unapprovedRevs)
{
    var mainPopUp = PopUp_getMainPopUp();
    PopUp_setToEventID(mainPopUp, unapprovedRevs[index].event_id);
    $(mainPopUp).draggable('disable');
}

function NO_init()
{
    PopUp_addCloseListener(function(id){
        NO_closeAllNotificationsForEventID(id);
    });
}

function NO_showSimilarEventsNotification(event_id, similarEvents)
{
    if ($('#' + event_id + '.alert').length > 0)
    {
        // notification already shown
        var noti = $('#' + event_id + '.alert')[0];
        if (similarEvents.length == 0)
        {
            // not similar anymore. remove
            SB_pop(noti);
            SB_hideIfEmpty();
        }
        else
        {
            $(noti).data('events', similarEvents);
        }
        return;
    }
    if (similarEvents.length == 0)
        return;
    var htmlContent = CacheMan_load('notifications-template');
    SB_push(htmlContent);
    var noti = $('#noti-123')[0];
    noti.id = event_id;
    $(noti).addClass('alert-warning');
    $(noti).find('#noti-content').html('<a href="#" class="alert-link" onclick="">A similar event</a> already exists.');
    $(noti).data('events', similarEvents);
    $(noti).find('#noti-content').on('click', function(ev){
        ev.preventDefault();
        SE_showSimilarEvents(event_id, $(noti).data('events'));
        SB_pop(noti);
        //NO_showSimilarEvents(event_id);
        //return false;
    });
    $(noti).find('button').on('click', function(){
        SB_pop(noti);
        //$(noti).remove();
        SB_hideIfEmpty();
    });
}
function NO_removeSimilarEventsNotification(event_id)
{
    SB_pop($('#' + event_id + '.alert.in')[0]);
    SB_hideIfEmpty();
}
function NO_hasSimilarEvents(event_id)
{
    return $('#' + event_id + '.alert.in').length > 0;
}

function NO_closeAllNotificationsForEventID(event_id)
{
    $('#'+event_id+'.alert').each(function(index){
        SB_pop(this);
    });
}

function NO_showUnapprovedRevisionsNotifications()
{
    }

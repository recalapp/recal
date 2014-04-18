function NO_init()
{
    PopUp_addCloseListener(function(id){
        NO_closeAllNotificationsForEventID(id);
    });
}
function NO_addRecentlyUpdated(text)
{
    var htmlContent = CacheMan_load('notifications-template');
    SB_push(htmlContent);
    var noti = $('#noti-123')[0];
    noti.id = '';
    $(noti).addClass('alert-info');
    $(noti).find('#noti-content').text(text);
    $(noti).find('button').on('click', function(){
        $(noti).remove();
        SB_hideIfEmpty();
    });
}

function NO_showSimilarEvents(event_id, similarEvents)
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
        SB_fill(); 
        SB_pop(noti);
        var popUp = PopUp_getPopUpByID(event_id)
        PopUp_markAsEditing(popUp);
        //$(popUp).data('is_editing', true);
        $(popUp).draggable('disable');
        var called = false; // TODO bad for memory
        SB_addWillCloseListener(function(){
            if (called)
                return;
            called = true;
            PopUp_markAsNotEditing(popUp);
            $(popUp).draggable('enable');
        });
        EP_initWithEvents(event_id, $(noti).data('events'));
        //return false;
    });
    $(noti).find('button').on('click', function(){
        SB_pop(noti);
        //$(noti).remove();
        SB_hideIfEmpty();
    });
}
function NO_hasSimilarEvents(id)
{
    return $('#' + event_id + '.alert').length > 0
}

function NO_closeAllNotificationsForEventID(event_id)
{
    $('#'+event_id+'.alert').each(function(index){
        SB_pop(this);
    });
}

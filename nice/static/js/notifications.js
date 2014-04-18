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
    var htmlContent = CacheMan_load('notifications-template');
    SB_push(htmlContent);
    var noti = $('#noti-123')[0];
    noti.id = event_id;
    $(noti).addClass('alert-warning');
    $(noti).find('#noti-content').html('<a href="#" class="alert-link" onclick="">A similar event</a> already exists.');
    $(noti).find('#noti-content').on('click', function(ev){
        ev.preventDefault();
        SB_fill(); 
        SB_pop(noti);
        var popUp = PopUp_getPopUpByID(event_id)
        $(popUp).data('is_editing', true);
        $(popUp).draggable('disable');
        EP_initWithEvents(similarEvents);
        //return false;
    });
    $(noti).find('button').on('click', function(){
        SB_pop(noti);
        //$(noti).remove();
        SB_hideIfEmpty();
    });
}

function NO_closeAllNotificationsForEventID(event_id)
{
    $('#'+event_id+'.alert').each(function(index){
        SB_pop(this);
    });
}

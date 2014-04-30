var NO_TYPES = {
    WARNING: 'alert-warning',
}
function NO_init()
{
    PopUp_addCloseListener(function(id){
        NO_removeNotificationID(id);
    });
}

function NO_showNotification(id, text, type, meta)
{
    var $noti;
    if (NO_hasNotificationID(id))
    {
        $noti = $('#'+id+'.alert');
    } else 
    {
        $noti = $(CacheMan_load('/notifications-template'));
        $noti.attr('id', id);
        SB_push($noti);
    }
    $noti.addClass(type);
    $text = $('<a>').addClass('alert-link').text(text).on('click', function(ev){
        ev.preventDefault();
        $noti.trigger('noti.click');
        SB_pop($noti);
    });
    $noti.find('#close_button').on('click', function(ev){
        ev.preventDefault();
        NO_removeNotificationID($noti.attr('id'));
    });
    $noti.find('#noti-content').append($text);
    //$(noti).data('events', similarEvents);
    if (meta)
    {
        $.each(meta, function(key, value){
            $noti.data(key, value);
        });
    }
    return $noti;
}
function NO_hasNotificationID(id)
{
    return $('#' + id + '.alert').length > 0;
}

function NO_removeNotificationID(id)
{
    if (!NO_hasNotificationID(id))
        return;
    SB_pop($('#' + id + '.alert.in')[0]);
    SB_hideIfEmpty();
}

//function NO_showSimilarEventsNotification(event_id, similarEvents)
//{
//    if ($('#' + event_id + '.alert').length > 0)
//    {
//        // notification already shown
//        var noti = $('#' + event_id + '.alert')[0];
//        if (similarEvents.length == 0)
//        {
//            // not similar anymore. remove
//            SB_pop(noti);
//            SB_hideIfEmpty();
//        }
//        else
//        {
//            $(noti).data('events', similarEvents);
//        }
//        return;
//    }
//    if (similarEvents.length == 0)
//        return;
//    var htmlContent = CacheMan_load('notifications-template');
//    SB_push(htmlContent);
//    var noti = $('#noti-123')[0];
//    noti.id = event_id;
//    $(noti).addClass('alert-warning');
//    $(noti).find('#noti-content').html('<a href="#" class="alert-link" onclick="">A similar event</a> already exists.');
//    $(noti).data('events', similarEvents);
//    $(noti).find('#noti-content').on('click', function(ev){
//        ev.preventDefault();
//        SE_showSimilarEvents(event_id, $(noti).data('events'));
//        SB_pop(noti);
//        //NO_showSimilarEvents(event_id);
//        //return false;
//    });
//    $(noti).find('button').on('click', function(){
//        SB_pop(noti);
//        //$(noti).remove();
//        SB_hideIfEmpty();
//    });
//}

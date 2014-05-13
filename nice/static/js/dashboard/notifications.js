/***************************************************
 * Notifications Module
 * Requires: Sidebar Module
 * Unlike the indicators module, this notifications
 * module is meant to have interactions with user.
 * The user can click on the notifications
 **************************************************/

// add as needed
var NO_TYPES = {
    WARNING: 'alert-warning',
    INFO: 'alert-info',
}


function NO_init()
{
    PopUp_addCloseListener(function(id){
        NO_removeNotificationID(id);
    });
}

/**
 * Show a new notification. Optionally pass along a metadata dictionary
 * to be stored with the notification
 */
function NO_showNotification(id, text, type, meta)
{
    var $noti;
    if (NO_hasNotificationID(id))
    {
        $noti = $('#'+id+'.alert');
    } else 
    {
        $noti = $('<div>').addClass('alert').addClass('alert-dismissible');
        SB_push($noti);
        $noti.append('<button id="close_button" type="button" class="close" aria-hidden="true">&times;</button>');
        $('<span id="noti-content">').appendTo($noti);
        $noti.attr('id', id);
        $text = $('<a>').addClass('alert-link').text(text).on('click', function(ev){
            ev.preventDefault();
            $noti.trigger('noti.click');
            SB_pop($noti);
        });
        $noti.find('#noti-content').empty();
        $noti.find('#noti-content').append($text);
        $noti.addClass(type);
        $noti.find('#close_button').on('click', function(ev){
            ev.preventDefault();
            NO_removeNotificationID($noti.attr('id'));
        });
    }
    
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

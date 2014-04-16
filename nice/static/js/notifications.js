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

function NO_showSimilarEvents()
{
    var htmlContent = CacheMan_load('notifications-template');
    SB_push(htmlContent);
    var noti = $('#noti-123')[0];
    noti.id = '';
    $(noti).addClass('alert-warning');
    $(noti).find('#noti-content').html('<a href="#" class="alert-link">A similar event</a> already exists.');
    $(noti).find('button').on('click', function(){
        SB_pop(noti);
        //$(noti).remove();
        SB_hideIfEmpty();
    });
}

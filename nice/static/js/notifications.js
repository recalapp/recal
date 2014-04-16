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

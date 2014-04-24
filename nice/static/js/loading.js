function LO_show()
{
    if ($('#loading').length > 0)
        return;
    var loading = CacheMan_load('/loading-template');
    $('body').append(loading);
    $('#loading').addClass('in');
}
function LO_hide()
{
    $('#loading').removeClass('in').on('transitionend', function(){
        $(this).remove();
    });
}

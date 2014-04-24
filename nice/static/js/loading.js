function LO_show()
{
    if ($('#loading').length > 0)
        return;
    var loading = CacheMan_load('/loading-template');
    $('body').append(loading);
}
function LO_hide()
{
    $('#loading').remove();
}

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
function LO_showError()
{
    if ($('#loading.error').length > 0)
        return;
    if ($('#loading').not('.error').length > 0)
        $('#loading').not('.error').remove();
    var loadingError = CacheMan_load('/loading-template');
    loadingError = $(loadingError).removeClass('alert-info').addClass('alert-danger');
    $(loadingError).find('#loading-content').text('Error connecting. Will keep trying');
    $('body').append(loadingError);
    $('#loading').addClass('in');
}

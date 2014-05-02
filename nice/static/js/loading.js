var LO_count = 0;

function LO_show()
{
    LO_count++;
    if ($('#loading').length > 0)
        return;
    if (LO_count <= 0)
        return;
    var $loading = LO_getLoadingHTML();
    $('body').append($loading);
    $('#loading').addClass('in');
}
function LO_hide()
{
    LO_count--;
    if (LO_count <= 0)
    {
        $('#loading').remove();
        //$('#loading').removeClass('in').on('transitionend', function(){
        //    $(this).remove();
        //});
    }
}
function LO_showError()
{
    if ($('#loading.error').length > 0)
        return;
    if ($('#loading').not('.error').length > 0)
        $('#loading').not('.error').remove();
    var $loadingError = LO_getLoadingHTML();
    $loadingError.removeClass('alert-info').addClass('alert-danger');
    $loadingError.find('#loading-content').text('Error connecting. Will keep trying');
    $('body').append($loadingError);
    $('#loading').addClass('in');
}
function LO_getLoadingHTML()
{
    var $loading = $('<div>').addClass('alert alert-dismissable alert-info');
    $loading.attr('id', 'loading');
    $loading.append($('<span id="loading-content">'));
    $loading.find('#loading-content').append('Loading...&nbsp;&nbsp;&nbsp;<i class="fa fa-spinner fa-spin"></i>');
    return $loading;
}

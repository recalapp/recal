var LO_count = 0;

var LO_idMap = null;
function LO_init()
{
    LO_idMap = {
        loading: new Set(),
        error: new Set(),
    };
}

function LO_showLoading(id)
{
    if (typeof id == 'undefined')
        return;
    LO_count++;
    if (id in LO_idMap.loading)
    {
        // TODO should do anything here?
        return;
    }
    LO_idMap.loading.add(id);
    if ($('#loading.in').length > 0)
        return;
    var $loading = LO_getLoadingHTML();
    $loading.attr('id', 'loading');
    $('#indicators-container').append($loading);
    $loading.addClass('in');
}
function LO_hideLoading(id)
{
    if (typeof id == 'undefined')
        return;
    LO_idMap.loading.remove(id);
    if (LO_idMap.loading.isEmpty())
    {
        $('#loading').remove();
    }
    LO_idMap.error.remove(id)
    if (LO_idMap.error.isEmpty())
    {
        // TODO should show success indicator
        $('#error').remove();
    }
    return;
    LO_count--;
    LO_count = LO_count < 0 ? 0 : LO_count;
    if (LO_count <= 0)
    {
        $('#loading').remove();
        //$('#loading').removeClass('in').on('transitionend', function(){
        //    $(this).remove();
        //});
    }
}
function LO_showError(id)
{
    if (typeof id == 'undefined')
        return;
    if (id in LO_idMap.error)
        return;
    LO_idMap.error.add(id);

    if ($('#error.in').length > 0)
        return;

    /*if ($('#loading.error').length > 0)
        return;
    if ($('#loading').not('.error').length > 0)
        $('#loading').not('.error').remove();*/
    var $loadingError = LO_getLoadingHTML();
    $loadingError.attr('id', 'error');
    $loadingError.removeClass('alert-info').addClass('alert-danger');
    $loadingError.find('#loading-content').text('Error connecting. Will keep trying');
    $('#indicators-container').append($loadingError);
    $loadingError.addClass('in');
}
function LO_getLoadingHTML()
{
    var $loading = $('<div>').addClass('indicator alert alert-dismissable alert-info');
    $loading.append($('<span id="loading-content">'));
    $loading.find('#loading-content').append('Loading...&nbsp;&nbsp;&nbsp;<i class="fa fa-spinner fa-spin"></i>');
    return $loading;
}

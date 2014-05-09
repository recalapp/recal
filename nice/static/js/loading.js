var LO_TYPES = {
    SUCCESS: 'alert-success',
}
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
    if (id in LO_idMap.loading)
    {
        // TODO should do anything here?
        return;
    }
    LO_idMap.loading.add(id);
    if ($('#loading.active').length > 0)
        return;
    var $loading = LO_getLoadingHTML();
    $loading.attr('id', 'loading');
    LO_insert($loading);
}
function LO_hideLoading(id, alsoHideErrorIfExists)
{
    if (typeof alsoHideErrorIfExists == 'undefined')
        alsoHideErrorIfExists = true;
    if (typeof id == 'undefined')
        return;
    LO_idMap.loading.remove(id);
    if (LO_idMap.loading.isEmpty())
    {
        LO_remove($('#loading.active'));
    }
    if (!alsoHideErrorIfExists)
        return;
    if (id in LO_idMap.error)
    {
        LO_idMap.error.remove(id);
        if (LO_idMap.error.isEmpty())
        {
            LO_remove($('#error.active'));
            LO_showTemporaryMessage('Connected :)', LO_TYPES.SUCCESS);
        }
    }
}
function LO_showError(id)
{
    if (typeof id == 'undefined')
        return;
    if (id in LO_idMap.error)
        return;
    LO_idMap.error.add(id);

    if ($('#error.active').length > 0)
        return;

    /*if ($('#loading.error').length > 0)
        return;
    if ($('#loading').not('.error').length > 0)
        $('#loading').not('.error').remove();*/
    var $loadingError = LO_getLoadingHTML();
    $loadingError.attr('id', 'error');
    $loadingError.removeClass('alert-info').addClass('alert-danger');
    $loadingError.find('#loading-content').html('Error connecting.<br>Will keep trying');
    LO_insert($loadingError); 
}
function LO_showTemporaryMessage(message, type)
{
    var $loading = LO_getLoadingHTML();
    $loading.removeClass('alert-info').addClass(type);
    $loading.find('#loading-content').text(message);
    LO_insert($loading);
    setTimeout(function(){
        LO_remove($loading);
    }, 1.5*1000);
}
function LO_remove($loading)
{
    $loading.on('transitionend', function(ev){
        $(this).remove();
    });
    $loading.removeClass('active');
    $loading.removeClass('in');
}
function LO_insert($loading)
{
    $('#indicators-container').append($loading);
    $loading.addClass('active'); // NOTE an indicator does not technically exists unless it has class 'active'
    $loading.addClass('in');
}
function LO_getLoadingHTML()
{
    var $loading = $('<div>').addClass('indicator alert alert-dismissable alert-info');
    $loading.append($('<span id="loading-content">'));
    $loading.find('#loading-content').append('Loading...&nbsp;&nbsp;&nbsp;<i class="fa fa-spinner fa-spin"></i>');
    return $loading;
}

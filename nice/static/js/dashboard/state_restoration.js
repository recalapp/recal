var SR_willSaveListeners = []
var SR_didLoadListeners = []
var SR_ON = true;
var SR_manager = {}
var SR_loaded = false;

function SR_init()
{
    SR_load();
    $(window).on('beforeunload', function(){
        SR_save();
    });
}

function SR_get(module)
{
    if (module in SR_manager)
        return SR_manager[module];
    else
        return null;
}

function SR_put(module, stateRes)
{
    SR_manager[module] = stateRes;
}

function SR_load()
{
    if (!SR_ON)
        return;
    $.get('get/state-restoration', null, function (data, textStatus, jqXHR) {
        if (data != '')
            SR_manager = data;
        SR_loaded = true;
        SR_callDidLoadListeners();
    }, 'json');
}

function SR_save()
{
    return;
    SR_callWillSaveListeners();
    $.ajax('put/state-restoration', {
        dataType: 'json',
        type: 'POST',
        data: {
            state_restoration: JSON.stringify(SR_manager),
        }, 
        async: false,
    });
}

function SR_addWillSaveListener(listener)
{
    SR_willSaveListeners.push(listener);
}

function SR_callWillSaveListeners()
{
    $.each(SR_willSaveListeners, function(index){
        this();
    });
}
function SR_addDidLoadListener(listener)
{
    if (SR_loaded)
        listener();
    else
        SR_didLoadListeners.push(listener)
}
function SR_callDidLoadListeners()
{
    $.each(SR_didLoadListeners, function(index){
        this();
    });
    SR_didLoadListeners = null;
}

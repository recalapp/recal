var RF_ACTIVE = true;
var RF_timeoutIDs = [];
var RF_INTERVAL = 10 * 1000;
var RF_FUNCTIONS = [];
var RF_MAX = 1000000;
var RF_COUNT = 0;
function RF_init()
{
    $(window).on('mousemove click', function(){
        $.each(RF_timeoutIDs, function(index){
            window.clearTimeout(this);
        });
        RF_timeoutIDs = [];
        RF_ACTIVE = true;
        RF_timeoutIDs.push(window.setTimeout(function(){
            RF_ACTIVE = false;
        }, 30*1000));
    });
    window.setInterval(function(){
        RF_COUNT = (RF_COUNT + 1) % RF_MAX;
        RF_callRecurringFunctions(RF_COUNT);
    }, RF_INTERVAL);
}
function RF_addRecurringFunction(recurringFunction, defaultInterval, idleInterval)
{
    RF_FUNCTIONS.push({
        recurringFunction: recurringFunction,
        defaultInterval: parseInt(defaultInterval / RF_INTERVAL),
        idleInterval: parseInt(idleInterval / RF_INTERVAL),
    });
}
function RF_callRecurringFunctions(count)
{
    $.each(RF_FUNCTIONS, function(index, functionDict){
        if (!RF_ACTIVE && (count % functionDict.idleInterval) == 0)
            functionDict.recurringFunction();
        else if ((count % functionDict.defaultInterval) == 0)
            functionDict.recurringFunction();
    });
}

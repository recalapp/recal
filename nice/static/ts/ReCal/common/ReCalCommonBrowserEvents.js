define(["require", "exports"], function(require, exports) {
    var ReCalCommonBrowserEvents = (function () {
        function ReCalCommonBrowserEvents() {
        }
        ReCalCommonBrowserEvents.popUpWasDroppedInSidebar = 'popUpWasDroppedInSidebar';
        ReCalCommonBrowserEvents.popUpWillDetachFromSidebar = 'popUpWillDetachFromSidebar';
        ReCalCommonBrowserEvents.popUpShouldClose = 'popUpShouldClose';

        ReCalCommonBrowserEvents.eventSelectionChanged = 'eventSelectionChanged';
        ReCalCommonBrowserEvents.eventsDataChanged = 'eventsDataChanged';
        return ReCalCommonBrowserEvents;
    })();

    
    return ReCalCommonBrowserEvents;
});

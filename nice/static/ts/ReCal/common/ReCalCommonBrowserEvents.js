define(["require", "exports"], function(require, exports) {
    var ReCalCommonBrowserEvents = (function () {
        function ReCalCommonBrowserEvents() {
        }
        ReCalCommonBrowserEvents.popUpWasDroppedInSidebar = 'popUpWasDroppedInSidebar';
        ReCalCommonBrowserEvents.popUpWillDetachFromSidebar = 'popUpWillDetachFromSidebar';

        ReCalCommonBrowserEvents.eventSelectionChanged = 'eventSelectionChanged';
        return ReCalCommonBrowserEvents;
    })();

    
    return ReCalCommonBrowserEvents;
});

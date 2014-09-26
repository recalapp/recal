define(["require", "exports"], function(require, exports) {
    var ReCalCommonBrowserEvents = (function () {
        function ReCalCommonBrowserEvents() {
        }
        ReCalCommonBrowserEvents.popUpWasDroppedInSidebar = 'popUpWasDroppedInSidebar';
        ReCalCommonBrowserEvents.popUpWillDetachFromSidebar = 'popUpWillDetachFromSidebar';
        ReCalCommonBrowserEvents.popUpShouldClose = 'popUpShouldClose';

        ReCalCommonBrowserEvents.editablePopUpDidSave = 'editablePopUpDidSave';

        ReCalCommonBrowserEvents.eventSelectionChanged = 'eventSelectionChanged';
        ReCalCommonBrowserEvents.eventsDataChanged = 'eventsDataChanged';
        return ReCalCommonBrowserEvents;
    })();

    
    return ReCalCommonBrowserEvents;
});
//# sourceMappingURL=ReCalCommonBrowserEvents.js.map

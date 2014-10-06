define(["require", "exports"], function(require, exports) {
    var ReCalCommonBrowserEvents = (function () {
        function ReCalCommonBrowserEvents() {
        }
        ReCalCommonBrowserEvents.popUpWasDroppedInSidebar = 'popUpWasDroppedInSidebar';
        ReCalCommonBrowserEvents.popUpWillDetachFromSidebar = 'popUpWillDetachFromSidebar';
        ReCalCommonBrowserEvents.popUpShouldClose = 'popUpShouldClose';

        ReCalCommonBrowserEvents.editablePopUpDidSave = 'editablePopUpDidSave';

        ReCalCommonBrowserEvents.eventSelectionChanged = 'eventSelectionChanged';
        ReCalCommonBrowserEvents.eventIdChanged = 'eventIdChanged';
        ReCalCommonBrowserEvents.eventsDataChanged = 'eventsDataChanged';
        ReCalCommonBrowserEvents.eventsWillBeginDownloading = 'eventsWillBeginDownloading';
        ReCalCommonBrowserEvents.eventsDidFinishDownloading = 'eventsDidFinishDownloading';
        ReCalCommonBrowserEvents.eventsDidFailDownloading = 'eventsDidFailDownloading';
        return ReCalCommonBrowserEvents;
    })();

    
    return ReCalCommonBrowserEvents;
});
//# sourceMappingURL=ReCalCommonBrowserEvents.js.map

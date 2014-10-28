define(["require", "exports"], function(require, exports) {
    var ReCalCommonBrowserEvents = (function () {
        function ReCalCommonBrowserEvents() {
        }
        ReCalCommonBrowserEvents.popUpWasDroppedInSidebar = 'popUpWasDroppedInSidebar';
        ReCalCommonBrowserEvents.popUpWillDetachFromSidebar = 'popUpWillDetachFromSidebar';
        ReCalCommonBrowserEvents.popUpShouldClose = 'popUpShouldClose';

        ReCalCommonBrowserEvents.editablePopUpDidSave = 'editablePopUpDidSave';

        ReCalCommonBrowserEvents.eventShouldBeAdded = 'eventShouldBeAdded';
        ReCalCommonBrowserEvents.eventSelectionChanged = 'eventSelectionChanged';
        ReCalCommonBrowserEvents.eventIdChanged = 'eventIdChanged';
        ReCalCommonBrowserEvents.eventShouldHide = 'eventShouldHide';
        ReCalCommonBrowserEvents.eventShouldUnhide = 'eventShouldUnhide';
        ReCalCommonBrowserEvents.eventsDataChanged = 'eventsDataChanged';
        ReCalCommonBrowserEvents.eventsWillBeginDownloading = 'eventsWillBeginDownloading';
        ReCalCommonBrowserEvents.eventsWillBeginUploading = 'eventsWillBeginUploading';
        ReCalCommonBrowserEvents.eventsDidFinishDownloading = 'eventsDidFinishDownloading';
        ReCalCommonBrowserEvents.eventsDidFinishUploading = 'eventsDidFinishUploading';
        ReCalCommonBrowserEvents.eventsDidFailDownloading = 'eventsDidFailDownloading';
        ReCalCommonBrowserEvents.eventsDidFailUploading = 'eventsDidFailUploading';

        ReCalCommonBrowserEvents.settingsDidChange = 'settingsDidChange';
        return ReCalCommonBrowserEvents;
    })();

    
    return ReCalCommonBrowserEvents;
});

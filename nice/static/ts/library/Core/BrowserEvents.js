define(["require", "exports"], function(require, exports) {
    var BrowserEvents = (function () {
        function BrowserEvents() {
        }
        BrowserEvents.blur = 'blur';
        BrowserEvents.click = 'click';
        BrowserEvents.focus = 'focus';
        BrowserEvents.focusIn = 'focusin';
        BrowserEvents.focusOut = 'focusout';
        BrowserEvents.mouseDown = 'mousedown';
        BrowserEvents.transitionEnd = 'transitionend';

        BrowserEvents.viewWasAppended = 'viewWasAppended';
        BrowserEvents.viewWasRemoved = 'viewWasRemoved';

        BrowserEvents.popUpWillDetach = 'popUpWillDetach';

        BrowserEvents.clickToEditComplete = 'clickToEditComplete';
        BrowserEvents.clickToEditShouldBegin = 'clickToEditShouldBegin';

        BrowserEvents.tableViewCellSelectionChanged = 'tableViewCellSelectionChanged';

        BrowserEvents.sidebarViewDidDrop = 'sidebarViewDidDrop';
        BrowserEvents.sidebarWillHide = 'sidebarWillHide';

        BrowserEvents.notificationShouldRemove = 'notificationShouldRemove';
        BrowserEvents.notificationShouldOpen = 'notificationShouldOpen';
        return BrowserEvents;
    })();
    
    return BrowserEvents;
});

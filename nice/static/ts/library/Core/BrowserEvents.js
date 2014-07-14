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

        BrowserEvents.viewWasAppended = 'viewWasAppended';
        BrowserEvents.viewWasRemoved = 'viewWasRemoved';

        BrowserEvents.popUpWillDetach = 'popUpWillDetach';

        BrowserEvents.clickToEditComplete = 'clickToEditComplete';
        BrowserEvents.clickToEditShouldBegin = 'clickToEditShouldBegin';
        return BrowserEvents;
    })();
    
    return BrowserEvents;
});

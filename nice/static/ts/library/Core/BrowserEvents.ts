class BrowserEvents {
    static blur = 'blur'; // does not bubble up
    static click = 'click';
    static focus = 'focus'; // does not bubble up
    static focusIn = 'focusin'; // bubbles up
    static focusOut = 'focusout'; // bubbles up
    static mouseDown = 'mousedown';
    
    static viewWasAppended = 'viewWasAppended';
    static viewWasRemoved = 'viewWasRemoved';
    
    static popUpWillDetach = 'popUpWillDetach';
    
    static clickToEditComplete = 'clickToEditComplete';
    static clickToEditShouldBegin = 'clickToEditShouldBegin';
}
export = BrowserEvents;

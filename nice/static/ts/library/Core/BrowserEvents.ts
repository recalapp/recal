class BrowserEvents {
    static blur = 'blur'; // does not bubble up
    static click = 'click';
    static focus = 'focus'; // does not bubble up
    static focusIn = 'focusin'; // bubbles up
    static focusOut = 'focusout'; // bubbles up
    static mouseDown = 'mousedown';
    
    // view
    static viewWasAppended = 'viewWasAppended';
    static viewWasRemoved = 'viewWasRemoved';
    
    // popup
    static popUpWillDetach = 'popUpWillDetach';
    
    // clickToEdit
    static clickToEditComplete = 'clickToEditComplete';
    static clickToEditShouldBegin = 'clickToEditShouldBegin';

    // table
    static tableViewCellSelectionChanged = 'tableViewCellSelectionChanged';
}
export = BrowserEvents;

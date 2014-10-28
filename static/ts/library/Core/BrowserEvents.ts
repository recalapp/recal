class BrowserEvents
{
    static blur = 'blur'; // does not bubble up
    static click = 'click';
    static focus = 'focus'; // does not bubble up
    static focusIn = 'focusin'; // bubbles up
    static focusOut = 'focusout'; // bubbles up
    static mouseDown = 'mousedown';
    static transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd';
    static keyPress = 'keypress';
    static keyDown = 'keydown';

    // Action Sheet
    static actionSheetDidSelectChoice = 'actionSheetDidSelectChoice';

    // bootstrap
    static bootstrapPopoverHidden = 'hidden.bs.popover';
    static bootstrapModalShow = 'show.bs.modal';
    static bootstrapModalHide = 'hide.bs.modal';

    // view
    static viewWasAppended = 'viewWasAppended';
    static viewWasRemoved = 'viewWasRemoved';

    // focusable view
    static focusableViewDidFocus = 'focusableViewDidFocus';
    static focusableViewDidBlur = 'focusableViewDidBlur';

    // popup
    static popUpWillDrag = 'popUpWillDrag';

    // clickToEdit
    static clickToEditComplete = 'clickToEditComplete';
    static clickToEditShouldBegin = 'clickToEditShouldBegin';

    // table
    static tableViewCellSelectionChanged = 'tableViewCellSelectionChanged';

    // sidebar
    static sidebarViewDidDrop = 'sidebarViewDidDrop';
    static sidebarWillHide = 'sidebarWillHide';

    // notifications
    static notificationShouldRemove = 'notificationShouldRemove';
    static notificationShouldOpen = 'notificationShouldOpen';

    // segmented control
    static segmentedControlSelectionChange = 'segmentedControlSelectionChange';
}
export = BrowserEvents;

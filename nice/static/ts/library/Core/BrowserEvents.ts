import NotImplementedException = require('./NotImplementedException');
export function getEventName(ev : Events) : String
{
    switch(ev)
    {
        case Events.click:
            return 'click';
        case Events.mouseDown:
            return 'mousedown';
        case Events.viewWasAppended:
            return 'viewWasAppended';
        case Events.viewWasRemoved:
            return 'viewWasRemoved';
        case Events.viewWillFocus:
            return 'viewWillFocus';
        case Events.viewDidFocus:
            return 'viewDidFocus';
        case Events.viewWillBlur:
            return 'viewWillBlur';
        case Events.viewDidBlur:
            return 'viewDidBlur';
        case Events.popUpWillDetach:
            return 'popUp_willDetach';
        default:
            throw new NotImplementedException(ev + ' is not supported');
    }
}
export enum Events {
    click,
    mouseDown,

    // View
    viewWasAppended,
    viewWasRemoved,
    viewWillFocus,
    viewDidFocus,
    viewWillBlur,
    viewDidBlur,

    // PopUp
    popUpWillDetach,
}

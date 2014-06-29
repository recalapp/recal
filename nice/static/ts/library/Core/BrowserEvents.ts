import NotImplementedException = require('./NotImplementedException');
export function getEventName(ev : Events) : String
{
    switch(ev)
    {
        case Events.click:
            return 'click';
        case Events.viewWasAppended:
            return 'viewWasAppended';
        case Events.mouseDown:
            return 'mousedown';
        default:
            throw new NotImplementedException(ev + ' is not supported');
    }
}
export enum Events {
    click,
    viewWasAppended,
    mouseDown,
}

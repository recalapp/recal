import DateTime = require('../../library/DateTime/DateTime');
import ICalendarViewEvent = require('./ICalendarViewEvent');

class CalendarViewEvent implements ICalendarViewEvent
{
    private _uniqueId: string = null;
    private _title: string = null;
    private _start: DateTime = null;
    private _end: DateTime = null;
    private _selected: boolean = false;
    private _highlighted: boolean = false;
    private _sectionColor: string = null;
    private _textColor: string = null;
    private _backgroundColor: string = null;
    private _borderColor: string = null;

    get uniqueId(): string
    {
        return this._uniqueId;
    }
    set uniqueId(value: string)
    {
        this._uniqueId = value;
    }

    get title(): string
    {
        return this._title;
    }
    set title(value: string)
    {
        this._title = value;
    }

    get start(): DateTime
    {
        return this._start;
    }
    set start(value: DateTime)
    {
        this._start = value;
    }

    get end(): DateTime
    {
        return this._end;
    }
    set end(value: DateTime)
    {
        this._end = value;
    }

    get selected(): boolean
    {
        return this._selected;
    }
    set selected(value: boolean)
    {
        this._selected = value;
    }

    get highlighted(): boolean
    {
        return this._highlighted;
    }
    set highlighted(value: boolean)
    {
        this._highlighted = value;
    }

    get sectionColor(): string
    {
        return this._sectionColor;
    }
    set sectionColor(value: string)
    {
        this._sectionColor = value;
    }

    get textColor(): string
    {
        return this._textColor;
    }
    set textColor(value: string)
    {
        this._textColor = value;
    }

    get backgroundColor(): string
    {
        return this._backgroundColor;
    }
    set backgroundColor(value: string)
    {
        this._backgroundColor = value;
    }

    get borderColor(): string
    {
        return this._borderColor;
    }
    set borderColor(value: string)
    {
        this._borderColor = value;
    }
}

export = CalendarViewEvent;

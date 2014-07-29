/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />

/// <amd-dependency path="moment-timezone" />
import moment = require('moment');

class DateTime
{
    private _momentObject: Moment = moment();
    private static _timeZone: string = null;

    get month(): number
    {
        return this._momentObject.month();
    }
    set month(value: number)
    {
        this._momentObject.month(value);
    }
    get date(): number
    {
        return this._momentObject.date();
    }
    set date(value: number)
    {
        this._momentObject.date(value);
    }
    get day(): number
    {
        return this._momentObject.day();
    }
    set day(value: number)
    {
        this._momentObject.day(value);
    }
    get hours(): number
    {
        return this._momentObject.hours();
    }
    set hours(value: number)
    {
        this._momentObject.hours(value);
    }
    get minutes(): number
    {
        return this._momentObject.minutes();
    }
    set minutes(value: number)
    {
        this._momentObject.minutes(value);
    }
    get seconds(): number
    {
        return this._momentObject.seconds();
    }
    set seconds(value: number)
    {
        this._momentObject.seconds(value);
    }
    get unix(): number
    {
        return this._momentObject.unix();
    }
    set unix(value: number)
    {
        this._momentObject = moment.unix(value);
    }

    constructor()
    {
    }

    public static fromUnix(unix: number): DateTime
    {
        var result = new DateTime();
        result._momentObject = moment.unix(unix);
        return result;
    }

    private _tryMakeTimeZone(): Moment
    {
        if (DateTime._timeZone === null)
        {
            return this._momentObject;
        }
        return this._momentObject.tz(DateTime._timeZone);
    }

    public calendar(): string
    {
        return this._tryMakeTimeZone().calendar();
    }
}

export = DateTime;

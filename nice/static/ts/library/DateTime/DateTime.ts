/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />

/// <amd-dependency path="moment-timezone" />
import moment = require('moment');
import Comparable = require('../Core/Comparable');
import ComparableResult = require('../Core/ComparableResult');
import InvalidActionException = require('../Core/InvalidActionException');

class DateTime implements Comparable
{
    private _momentObject: Moment = moment();
    private static _timeZone: string = null;

    private static _max: DateTime = new DateTime();
    private static _min: DateTime = new DateTime();

    static get max(): DateTime
    {
        return DateTime._max;
    }
    static get min(): DateTime
    {
        return DateTime._min;
    }

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


    constructor();
    constructor(momentObject: Moment);
    constructor(toParse: Date);
    constructor(arg?: any)
    {
        if (arg)
        {
            if (arg instanceof Date)
            {
                this._momentObject = moment(<Date>arg);
            }
            else
            {
                this.unix = (<Moment>arg).unix();
            }
        }
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

    public format(format?: string): string
    {
        return this._tryMakeTimeZone().format(format);
    }

    public toJsDate(): Date
    {
        return this._tryMakeTimeZone().toDate();
    }

    public compareTo(other: DateTime): ComparableResult
    {
        if (other === null || other === undefined)
        {
            throw new InvalidActionException('Cannot compare a DateTime with a null or undefined object');
        }
        if (this === other || this.unix === other.unix)
        {
            // catches all cases of equal, including when they are both max or both min
            return ComparableResult.equal;
        }
        if (this === DateTime.max)
        {
            return ComparableResult.greater;
        }
        if (this === DateTime.min)
        {
            return ComparableResult.less;
        }
        if (other === DateTime.max)
        {
            return ComparableResult.less;
        }
        if (other === DateTime.min)
        {
            return ComparableResult.greater;
        }
        return this.unix - other.unix > 0 ? ComparableResult.greater : ComparableResult.less;
    }

    public equals(other: DateTime): boolean
    {
        if (other === null || other === undefined)
        {
            return false; // don't throw exception - it's just not equal
        }
        return this.compareTo(other) === ComparableResult.equal;
    }
}

export = DateTime;

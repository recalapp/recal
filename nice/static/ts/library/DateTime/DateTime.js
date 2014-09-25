/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
define(["require", "exports", 'moment', '../Core/ComparableResult', '../Core/InvalidActionException', "moment-timezone"], function(require, exports, moment, ComparableResult, InvalidActionException) {
    var DateTime = (function () {
        function DateTime(arg) {
            this._momentObject = moment();
            if (arg) {
                if (arg instanceof Date) {
                    this._momentObject = moment(arg);
                } else if (arg instanceof DateTime) {
                    this.unix = arg.unix;
                } else {
                    this.unix = arg.unix();
                }
            }
        }
        Object.defineProperty(DateTime, "max", {
            get: function () {
                return DateTime._max;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime, "min", {
            get: function () {
                return DateTime._min;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(DateTime.prototype, "month", {
            get: function () {
                return this._momentObject.month();
            },
            set: function (value) {
                this._momentObject.month(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "date", {
            get: function () {
                return this._momentObject.date();
            },
            set: function (value) {
                this._momentObject.date(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "day", {
            get: function () {
                return this._momentObject.day();
            },
            set: function (value) {
                this._momentObject.day(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "hours", {
            get: function () {
                return this._momentObject.hours();
            },
            set: function (value) {
                this._momentObject.hours(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "minutes", {
            get: function () {
                return this._momentObject.minutes();
            },
            set: function (value) {
                this._momentObject.minutes(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "seconds", {
            get: function () {
                return this._momentObject.seconds();
            },
            set: function (value) {
                this._momentObject.seconds(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "unix", {
            get: function () {
                return this._momentObject.unix();
            },
            set: function (value) {
                this._momentObject = moment.unix(value);
            },
            enumerable: true,
            configurable: true
        });

        DateTime.fromUnix = function (unix) {
            var result = new DateTime();
            result._momentObject = moment.unix(unix);
            return result;
        };

        DateTime.prototype._tryMakeTimeZone = function () {
            if (DateTime._timeZone === null) {
                return this._momentObject;
            }
            return this._momentObject.tz(DateTime._timeZone);
        };

        DateTime.prototype.calendar = function () {
            return this._tryMakeTimeZone().calendar();
        };

        DateTime.prototype.format = function (format) {
            return this._tryMakeTimeZone().format(format);
        };

        DateTime.prototype.toJsDate = function () {
            return this._tryMakeTimeZone().toDate();
        };

        DateTime.prototype.compareTo = function (other) {
            if (other === null || other === undefined) {
                throw new InvalidActionException('Cannot compare a DateTime with a null or undefined object');
            }
            if (this === other || this.unix === other.unix) {
                // catches all cases of equal, including when they are both max or both min
                return 0 /* equal */;
            }
            if (this === DateTime.max) {
                return 1 /* greater */;
            }
            if (this === DateTime.min) {
                return -1 /* less */;
            }
            if (other === DateTime.max) {
                return -1 /* less */;
            }
            if (other === DateTime.min) {
                return 1 /* greater */;
            }
            return this.unix - other.unix > 0 ? 1 /* greater */ : -1 /* less */;
        };

        DateTime.prototype.equals = function (other) {
            if (other === null || other === undefined) {
                return false;
            }
            return this.compareTo(other) === 0 /* equal */;
        };
        DateTime._timeZone = null;

        DateTime._max = new DateTime();
        DateTime._min = new DateTime();
        return DateTime;
    })();

    
    return DateTime;
});

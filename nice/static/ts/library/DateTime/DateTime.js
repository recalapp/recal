/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
define(["require", "exports", 'moment', "moment-timezone"], function(require, exports, moment) {
    var DateTime = (function () {
        function DateTime() {
            this._momentObject = moment();
        }
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
        DateTime._timeZone = null;
        return DateTime;
    })();

    
    return DateTime;
});

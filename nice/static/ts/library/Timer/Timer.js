/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", "jquery", '../Core/InvalidArgumentException'], function(require, exports, $, InvalidArgumentException) {
    var Timer = (function () {
        function Timer(action, interval, repeating, idleInterval, idleLimit) {
            if (typeof repeating === "undefined") { repeating = false; }
            if (typeof idleLimit === "undefined") { idleLimit = 60 * 1000; }
            var _this = this;
            this._isIdle = false;
            /**
            * The timeout id of the observer used to check whether or not a system is
            * idle
            * @type {number}
            * @private
            */
            this._observerTimeoutId = null;
            /**
            * The timeout id of the recurring function.
            * @type {number}
            * @private
            */
            this._intervalId = null;
            /**
            * The timeout id of the recurring function when idle
            * @type {number}
            * @private
            */
            this._idleIntervalId = null;
            if (idleInterval === undefined || idleInterval === null) {
                idleInterval = interval;
            }
            if (interval < 0 || idleInterval < 0) {
                throw new InvalidArgumentException("Intervals must be nonnegative");
            }
            if (repeating) {
                setInterval(function () {
                    if (!_this.isIdle) {
                        action();
                    }
                }, interval);
                setInterval(function () {
                    if (_this.isIdle) {
                        action();
                    }
                }, idleInterval);
                $(window).on('mousemove click keydown', function () {
                    if (_this.observerTimeoutId !== null) {
                        clearTimeout(_this.observerTimeoutId);
                        _this.observerTimeoutId = null;
                    }
                    _this.isIdle = false;
                    _this.observerTimeoutId = setTimeout(function () {
                        _this.isIdle = true;
                    }, idleLimit);
                });
            } else {
                setTimeout(action, interval);
            }
        }
        Object.defineProperty(Timer.prototype, "isIdle", {
            get: function () {
                return this._isIdle;
            },
            set: function (value) {
                this._isIdle = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Timer.prototype, "observerTimeoutId", {
            get: function () {
                return this._observerTimeoutId;
            },
            set: function (value) {
                this._observerTimeoutId = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Timer.prototype, "intervalId", {
            get: function () {
                return this._intervalId;
            },
            set: function (value) {
                this._intervalId = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Timer.prototype, "idleIntervalId", {
            get: function () {
                return this._idleIntervalId;
            },
            set: function (value) {
                this._idleIntervalId = value;
            },
            enumerable: true,
            configurable: true
        });

        Timer.prototype.stop = function () {
            if (this.idleIntervalId !== null) {
                clearInterval(this.idleIntervalId);
                this.idleIntervalId = null;
            }
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            if (this.observerTimeoutId !== null) {
                clearTimeout(this.observerTimeoutId);
                this.observerTimeoutId = null;
            }
        };
        return Timer;
    })();
    
    return Timer;
});
//# sourceMappingURL=Timer.js.map

define(["require", "exports"], function(require, exports) {
    var CalendarViewEvent = (function () {
        function CalendarViewEvent() {
            this._uniqueId = null;
            this._title = null;
            this._start = null;
            this._end = null;
            this._selected = false;
            this._highlighted = false;
            this._sectionColor = null;
            this._textColor = null;
            this._backgroundColor = null;
            this._borderColor = null;
        }
        Object.defineProperty(CalendarViewEvent.prototype, "uniqueId", {
            get: function () {
                return this._uniqueId;
            },
            set: function (value) {
                this._uniqueId = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (value) {
                this._title = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "start", {
            get: function () {
                return this._start;
            },
            set: function (value) {
                this._start = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "end", {
            get: function () {
                return this._end;
            },
            set: function (value) {
                this._end = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (value) {
                this._selected = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "highlighted", {
            get: function () {
                return this._highlighted;
            },
            set: function (value) {
                this._highlighted = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "sectionColor", {
            get: function () {
                return this._sectionColor;
            },
            set: function (value) {
                this._sectionColor = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "textColor", {
            get: function () {
                return this._textColor;
            },
            set: function (value) {
                this._textColor = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "backgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (value) {
                this._backgroundColor = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarViewEvent.prototype, "borderColor", {
            get: function () {
                return this._borderColor;
            },
            set: function (value) {
                this._borderColor = value;
            },
            enumerable: true,
            configurable: true
        });
        return CalendarViewEvent;
    })();

    
    return CalendarViewEvent;
});
//# sourceMappingURL=CalendarViewEvent.js.map

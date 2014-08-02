var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/AbstractMethodException', '../../library/CoreUI/ViewController'], function(require, exports, AbstractMethodException, ViewController) {
    var CalendarViewController = (function (_super) {
        __extends(CalendarViewController, _super);
        function CalendarViewController() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(CalendarViewController.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * The array of calendar view events
        */
        CalendarViewController.prototype.calendarViewEvents = function () {
            throw new AbstractMethodException();
        };

        /**
        * The height for calendar view. e.g. "250px"
        */
        CalendarViewController.prototype.heightForCalendarView = function () {
            throw new AbstractMethodException();
        };

        /**
        * Returns true if the event should be highlighted
        */
        CalendarViewController.prototype.eventIsHighlighted = function (calendarViewEvent) {
            throw new AbstractMethodException();
        };
        return CalendarViewController;
    })(ViewController);

    
    return CalendarViewController;
});

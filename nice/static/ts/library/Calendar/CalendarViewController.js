var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/AbstractMethodException', '../../library/CoreUI/ViewController'], function(require, exports, AbstractMethodException, ViewController) {
    var CalendarViewController = (function (_super) {
        __extends(CalendarViewController, _super);
        function CalendarViewController(view) {
            _super.call(this, view);
            this.view.dataSource = this;
            this.view.delegate = this;
        }
        Object.defineProperty(CalendarViewController.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });

        /********************************************************************
        Data Source
        ******************************************************************/
        /**
        * Returns true if a cell should be deselected
        * when it is selected and clicked on again.
        */
        CalendarViewController.prototype.shouldToggleSelection = function () {
            return true;
        };

        /**
        * The array of calendar view events in range
        */
        CalendarViewController.prototype.calendarViewEventsForRange = function (start, end) {
            throw new AbstractMethodException();
        };

        /**
        * The height for calendar view in pixels
        */
        CalendarViewController.prototype.heightForCalendarView = function () {
            throw new AbstractMethodException();
        };

        /********************************************************************
        Delegate
        ******************************************************************/
        /**
        * Callback for when an event is selected
        */
        CalendarViewController.prototype.didSelectEvent = function (calendarViewEvent) {
        };

        /**
        * Callback for when an event is deselected
        */
        CalendarViewController.prototype.didDeselectEvent = function (calendarViewEvent) {
        };
        return CalendarViewController;
    })(ViewController);

    
    return CalendarViewController;
});
//# sourceMappingURL=CalendarViewController.js.map

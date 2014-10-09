/// <reference path="../../../typings/tsd.d.ts" />
/// <amd-dependency path="bootstrap" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Calendar/CalendarViewController', "bootstrap"], function(require, exports, CalendarViewController) {
    var NiceCalendarViewController = (function (_super) {
        __extends(NiceCalendarViewController, _super);
        function NiceCalendarViewController(calendarView, dependencies) {
            _super.call(this, calendarView);
            /**
            * Events Operations Facade
            */
            this._eventsOperationsFacade = null;
            this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
            this.initialize();
        }
        Object.defineProperty(NiceCalendarViewController.prototype, "eventsOperationsFacade", {
            get: function () {
                return this._eventsOperationsFacade;
            },
            enumerable: true,
            configurable: true
        });

        NiceCalendarViewController.prototype.initialize = function () {
            var _this = this;
            $('#calendar.tab-pane').each(function (index, pane) {
                $(pane).on('transitionend', function (ev) {
                    if ($(pane).hasClass('in')) {
                        // TODO render
                        _this.view.render();
                        _this.view.refresh();
                    }
                });
            });

            // TODO check if visible
            this.view.refresh();
        };

        /********************************************************************
        Data Source
        ******************************************************************/
        /**
        * Returns true if a cell should be deselected
        * when it is selected and clicked on again.
        */
        NiceCalendarViewController.prototype.shouldToggleSelection = function () {
            return false;
        };

        /**
        * The array of calendar view events in range
        */
        NiceCalendarViewController.prototype.calendarViewEventsForRange = function (start, end) {
            return [];
        };

        /**
        * The height for calendar view in pixels
        */
        NiceCalendarViewController.prototype.heightForCalendarView = function () {
            return window.innerHeight - $('.navbar').height() - 50;
        };
        return NiceCalendarViewController;
    })(CalendarViewController);

    
    return NiceCalendarViewController;
});

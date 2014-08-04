/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../DateTime/DateTime', '../CoreUI/View', "fullcalendar"], function(require, exports, $, DateTime, View) {
    var CalendarView = (function (_super) {
        __extends(CalendarView, _super);
        function CalendarView() {
            _super.apply(this, arguments);
            this._dataSource = null;
            this._delegate = null;
            this._defaultOptions = {
                defaultView: "agendaWeek",
                slotMinutes: 30,
                firstHour: 8,
                minTime: 8,
                maxTime: 23,
                eventDurationEditable: false,
                eventStartEditable: false,
                //eventBackgroundColor: "#74a2ca",
                //eventBorderColor: "#428bca",
                allDayDefault: false,
                ignoreTimezone: true,
                allDaySlot: false,
                slotEventOverlap: true
            };
        }
        Object.defineProperty(CalendarView.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            set: function (value) {
                if (value != this._dataSource) {
                    this._dataSource = value;
                    this.initializeCalendar();
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CalendarView.prototype, "delegate", {
            get: function () {
                return this._delegate;
            },
            set: function (value) {
                this._delegate = value;
            },
            enumerable: true,
            configurable: true
        });

        CalendarView.prototype.initializeCalendar = function () {
            var _this = this;
            // deinitialize if needed
            this._$el.fullCalendar('destroy');

            // set default options
            this._defaultOptions.eventSources = [{
                    events: function (start, end, timezone, callback) {
                        // TODO verify that the moment objects passed actually are correct in timezone
                        callback(_this.retrieveCalendarEvents(new DateTime(start), new DateTime(end)));
                    }
                }];
            this._defaultOptions.height = this.dataSource.heightForCalendarView();
            this._defaultOptions.eventClick = function (calEvent, jsEvent, html) {
                _this.handleClick(calEvent, jsEvent, html);
            };
            this._defaultOptions.windowResize = function (view) {
                _this._$el.fullCalendar('option', 'height', _this.dataSource.heightForCalendarView());
            };

            // initialize
            this._$el.fullCalendar(this._defaultOptions);
        };

        CalendarView.prototype.handleClick = function (calEvent, jsEvent, html) {
            // TODO handle single selection - multiple by default like table view
            if (!calEvent.calendarViewEvent.selected || !this.dataSource.shouldToggleSelection()) {
                this.selectCalendarEvent(calEvent);
                if (this.delegate) {
                    this.delegate.didSelectEvent(calEvent.calendarViewEvent);
                }
            } else {
                // toggle selection on - deselect the cell
                this.deselectCalendarEvent(calEvent);
                if (this.delegate) {
                    this.delegate.didDeselectEvent(calEvent.calendarViewEvent);
                }
            }
        };

        CalendarView.prototype.retrieveCalendarEvents = function (start, end) {
            if (this.dataSource === null || this.dataSource === undefined) {
                return [];
            }
            var calendarEventArray = this.dataSource.calendarViewEventsForRange(start, end);
            var results = new Array();
            $.each(calendarEventArray, function (index, calendarViewEvent) {
                // TODO verify timezone
                results.push({
                    id: calendarViewEvent.uniqueId,
                    title: calendarViewEvent.title,
                    start: calendarViewEvent.start.toJsDate(),
                    end: calendarViewEvent.end.toJsDate(),
                    textColor: calendarViewEvent.textColor,
                    backgroundColor: calendarViewEvent.backgroundColor,
                    borderColor: calendarViewEvent.borderColor,
                    calendarViewEvent: calendarViewEvent
                });
            });
            return results;
        };

        CalendarView.prototype.selectCalendarEventsWithId = function (uniqueId) {
            var _this = this;
            var calEvents = this.getCalendarEventsWithId(uniqueId);
            $.each(calEvents, function (index, calEvent) {
                _this.selectCalendarEvent(calEvent);
            });
        };
        CalendarView.prototype.deselectCalendarEventsWithId = function (uniqueId) {
            var _this = this;
            var calEvents = this.getCalendarEventsWithId(uniqueId);
            $.each(calEvents, function (index, calEvent) {
                _this.deselectCalendarEvent(calEvent);
            });
        };

        CalendarView.prototype.getCalendarEventsWithId = function (uniqueId) {
            return this._$el.fullCalendar('clientEvents', uniqueId);
        };

        CalendarView.prototype.selectCalendarEvent = function (calEvent) {
            calEvent.calendarViewEvent.selected = true;
        };

        CalendarView.prototype.deselectCalendarEvent = function (calEvent) {
            calEvent.calendarViewEvent.selected = false;
        };

        CalendarView.prototype.refresh = function () {
            this._$el.fullCalendar('refetchEvents');
        };
        return CalendarView;
    })(View);
    
    return CalendarView;
});

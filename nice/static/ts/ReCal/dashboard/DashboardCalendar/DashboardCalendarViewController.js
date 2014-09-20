/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../../../library/Calendar/CalendarViewController', '../../common/ReCalCalendar/ReCalCalendarViewEventAdapter'], function(require, exports, $, CalendarViewController, ReCalCalendarViewEventAdapter) {
    var DashboardCalendarViewController = (function (_super) {
        __extends(DashboardCalendarViewController, _super);
        function DashboardCalendarViewController(calendarView, dependencies) {
            _super.call(this, calendarView);
            /**
            * Events Operations Facade
            */
            this._eventsOperationsFacade = null;
            this._eventsOperationsFacade = dependencies.eventsOperationsFacade;
            this.initialize();
        }
        Object.defineProperty(DashboardCalendarViewController.prototype, "eventsOperationsFacade", {
            get: function () {
                return this._eventsOperationsFacade;
            },
            enumerable: true,
            configurable: true
        });

        DashboardCalendarViewController.prototype.initialize = function () {
            // deselect when closing events
            //PopUp_addCloseListener((eventId: string)=>
            //{
            //    this.view.deselectCalendarEventsWithId(eventId);
            //    var calEvent: ICalendarViewEvent = this.view.getCalendarViewEventWithId(eventId);
            //    this.unhighlightCalendarEvent(calEvent);
            //    this.view.updateCalendarViewEvent(calEvent);
            //});
            var _this = this;
            // reload before displaying
            // TODO check if visible
            EventsMan_addUpdateListener(function () {
                _this.view.refresh();
            });
            $('#' + SE_id).on('close', function (ev) {
                _this.view.refresh();
            });
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
        DashboardCalendarViewController.prototype.highlightCalendarEvent = function (calEvent) {
            if (calEvent.highlighted) {
                return;
            }
            var backgroundColor = calEvent.sectionColor;
            backgroundColor = colorLuminance(backgroundColor, FACTOR_LUM);
            calEvent.backgroundColor = rgbToRgba(luminanceToRgb(backgroundColor), 1.0);
            calEvent.borderColor = calEvent.backgroundColor;
            calEvent.textColor = '#ffffff';
            calEvent.highlighted = true;
        };
        DashboardCalendarViewController.prototype.unhighlightCalendarEvent = function (calEvent) {
            if (!calEvent.highlighted) {
                return;
            }
            var factor_trans = (THEME == 'w') ? FACTOR_TRANS : FACTOR_TRANS_DARK;
            var backgroundColor = calEvent.sectionColor;
            backgroundColor = colorLuminance(backgroundColor, FACTOR_LUM);
            calEvent.backgroundColor = rgbToRgba(luminanceToRgb(backgroundColor), factor_trans);
            calEvent.borderColor = setOpacity(calEvent.backgroundColor, 1.0);
            calEvent.textColor = calEvent.sectionColor;
            calEvent.highlighted = false;
        };

        DashboardCalendarViewController.prototype.reload = function () {
            LO_showLoading('cal loading');
            this.view.refresh();
            LO_hideLoading('cal loading');
        };

        /********************************************************************
        Data Source
        ******************************************************************/
        /**
        * Returns true if a cell should be deselected
        * when it is selected and clicked on again.
        */
        DashboardCalendarViewController.prototype.shouldToggleSelection = function () {
            return false;
        };

        /**
        * The array of calendar view events in range
        */
        DashboardCalendarViewController.prototype.calendarViewEventsForRange = function (start, end) {
            var _this = this;
            var eventsOperationsFacade = this.eventsOperationsFacade;
            var eventIds = eventsOperationsFacade.getEventIdsInRange(start, end);
            var calendarEvents = new Array();
            $.each(eventIds, function (index, eventId) {
                var eventsModel = eventsOperationsFacade.getEventById(eventId);
                var calEventAdapter = new ReCalCalendarViewEventAdapter(eventsModel);
                var calEvent = calEventAdapter.calendarViewEvent;
                calEvent.selected = eventsOperationsFacade.eventIdIsSelected(eventId);
                calEvent.highlighted = !calEvent.selected; // forces first highlighting
                calEvent.selected ? _this.highlightCalendarEvent(calEvent) : _this.unhighlightCalendarEvent(calEvent);
                calendarEvents.push(calEvent);
            });
            return calendarEvents;
        };

        /**
        * The height for calendar view in pixels
        */
        DashboardCalendarViewController.prototype.heightForCalendarView = function () {
            return window.innerHeight - $('.navbar').height() - 50;
        };

        /********************************************************************
        Delegate
        ******************************************************************/
        /**
        * Callback for when an event is selected
        */
        DashboardCalendarViewController.prototype.didSelectEvent = function (calendarViewEvent) {
            var _this = this;
            var eventsOperationsFacade = this.eventsOperationsFacade;
            var eventId = calendarViewEvent.uniqueId;

            if (eventsOperationsFacade.eventIdIsSelected(eventId)) {
                eventsOperationsFacade.selectEventWithId(eventId);
            } else {
                // TODO bring event popup into focus - maybe simply by calling select again?
                eventsOperationsFacade.selectEventWithId(eventId); // TODO works? Does this cause the popup to come into focus?
            }

            // update selection. deselect any events no longer relevant
            this.highlightCalendarEvent(calendarViewEvent);
            this.view.updateCalendarViewEvent(calendarViewEvent);
            $.each(this.view.selectedCalendarViewEvents(), function (index, selectedEvent) {
                var eventId = selectedEvent.uniqueId;
                if (!eventsOperationsFacade.eventIdIsSelected(eventId)) {
                    _this.view.deselectCalendarEventsWithId(eventId);
                    _this.unhighlightCalendarEvent(selectedEvent);
                    _this.view.updateCalendarViewEvent(selectedEvent);
                }
            });
        };
        return DashboardCalendarViewController;
    })(CalendarViewController);

    
    return DashboardCalendarViewController;
});

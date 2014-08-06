/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../../../library/Calendar/CalendarViewController', '../../../library/Calendar/CalendarViewEvent', '../../../library/DateTime/DateTime'], function(require, exports, $, CalendarViewController, CalendarViewEvent, DateTime) {
    var DashboardCalendarViewController = (function (_super) {
        __extends(DashboardCalendarViewController, _super);
        function DashboardCalendarViewController() {
            _super.apply(this, arguments);
        }
        DashboardCalendarViewController.prototype.initialize = function () {
            var _this = this;
            // deselect when closing events
            PopUp_addCloseListener(function (eventId) {
                _this.view.deselectCalendarEventsWithId(eventId);
                var calEvent = _this.view.getCalendarViewEventWithId(eventId);
                _this.unhighlightCalendarEvent(calEvent);
                _this.view.updateCalendarViewEvent(calEvent);
            });

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
            var eventIds = EventsMan_getEventIDForRange(start.unix, end.unix);
            var calendarEvents = new Array();
            $.each(eventIds, function (index, eventId) {
                var eventDict = EventsMan_getEventByID(eventId);
                var calEvent = new CalendarViewEvent();
                calEvent.uniqueId = eventId;
                calEvent.title = eventDict['event_title'];
                calEvent.start = DateTime.fromUnix(parseInt(eventDict.event_start));
                calEvent.end = DateTime.fromUnix(parseInt(eventDict.event_end));
                calEvent.sectionColor = SECTION_COLOR_MAP[eventDict.section_id]['color'];
                calEvent.selected = UI_isPinned(eventId) || UI_isMain(eventId);
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
            var eventId = calendarViewEvent.uniqueId;
            var popUp = PopUp_getPopUpByID(eventId);
            if (popUp === null || popUp === undefined) {
                // create the popup
                popUp = PopUp_getMainPopUp();
                PopUp_setToEventID(popUp, eventId);
                // TODO handle success/retry logic. was needed for when popup has uncommitted changes
            }
            PopUp_giveFocus(popUp);

            // update selection. deselect any events no longer relevant
            this.highlightCalendarEvent(calendarViewEvent);
            this.view.updateCalendarViewEvent(calendarViewEvent);
            $.each(this.view.selectedCalendarViewEvents(), function (index, selectedEvent) {
                var eventId = selectedEvent.uniqueId;
                if (!UI_isMain(eventId) && !UI_isPinned(eventId)) {
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

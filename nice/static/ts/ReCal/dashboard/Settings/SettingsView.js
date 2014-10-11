/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/DataStructures/Dictionary', '../../../library/SegmentedControl/SegmentedControlMultipleSelectView', '../../../library/SegmentedControl/SegmentedControlSingleSelectView', '../../../library/DataStructures/Set', '../../../library/CoreUI/View'], function(require, exports, BrowserEvents, Dictionary, SegmentedControlMultipleSelectView, SegmentedControlSingleSelectView, Set, View) {
    var SettingsView = (function (_super) {
        __extends(SettingsView, _super);
        /***************************************************************************
        * Methods
        **************************************************************************/
        function SettingsView($element, cssClass) {
            _super.call(this, $element, cssClass);
            /***************************************************************************
            * Settings options
            **************************************************************************/
            this._possibleEventTypes = null;
            this._agendaSelectedEventTypes = null;
            this._calendarSelectedEventTypes = null;
            this._eventsHidden = false;
            this._isLocalTimezone = false;
            this._possibleCourses = null;
            this._visibleCourses = null;
            /***************************************************************************
            * Subviews
            **************************************************************************/
            this._agendaOptionsView = null;
            this._calendarOptionsView = null;
            this._timezoneOptionsView = null;
            this._courseOptionsView = null;
            this._eventsVisibilityOptionsView = null;
            this.render();
        }
        Object.defineProperty(SettingsView.prototype, "possibleEventTypes", {
            get: function () {
                if (!this._possibleEventTypes) {
                    this._possibleEventTypes = new Dictionary();
                }
                return this._possibleEventTypes;
            },
            set: function (value) {
                if (value === null || value === undefined) {
                    value = new Dictionary();
                }
                this._possibleEventTypes = value;
                this.renderAgendaOptionsView();
                this.renderCalendarOptionsView();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "agendaSelectedEventTypesSet", {
            get: function () {
                if (!this._agendaSelectedEventTypes) {
                    this._agendaSelectedEventTypes = new Set();
                }
                return this._agendaSelectedEventTypes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsView.prototype, "agendaSelectedEventTypes", {
            get: function () {
                return this.agendaSelectedEventTypesSet.toArray();
            },
            set: function (value) {
                if (value === null || value === undefined) {
                    value = [];
                }
                this._agendaSelectedEventTypes = new Set(value);
                this.renderAgendaOptionsView();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "calendarSelectedEventTypesSet", {
            get: function () {
                if (!this._calendarSelectedEventTypes) {
                    this._calendarSelectedEventTypes = new Set();
                }
                return this._calendarSelectedEventTypes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsView.prototype, "calendarSelectedEventTypes", {
            get: function () {
                return this.calendarSelectedEventTypesSet.toArray();
            },
            set: function (value) {
                if (value === null || value === undefined) {
                    value = [];
                }
                this._calendarSelectedEventTypes = new Set(value);
                this.renderCalendarOptionsView();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "eventsHidden", {
            get: function () {
                return this._eventsHidden;
            },
            set: function (value) {
                this._eventsHidden = value;
                this.renderEventsVisibilityOptions();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "isLocalTimezone", {
            get: function () {
                return this._isLocalTimezone;
            },
            set: function (value) {
                value = value || false;
                this._isLocalTimezone = value;
                this.renderTimezoneOptionsView();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "possibleCourses", {
            get: function () {
                if (!this._possibleCourses) {
                    this._possibleCourses = new Set();
                }
                return this._possibleCourses.toArray();
            },
            set: function (value) {
                value = value || [];
                this._possibleCourses = new Set(value);
                this.renderCourseOptionsView();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "visibleCoursesSet", {
            get: function () {
                if (!this._visibleCourses) {
                    this._visibleCourses = new Set();
                }
                return this._visibleCourses;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsView.prototype, "visibleCourses", {
            get: function () {
                return this.visibleCoursesSet.toArray();
            },
            set: function (value) {
                value = value || [];
                this._visibleCourses = new Set(value);
                this.renderCourseOptionsView();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "agendaOptionsView", {
            get: function () {
                if (!this._agendaOptionsView) {
                    this._agendaOptionsView = View.fromJQuery(this.findJQuery('#agenda-options'));
                }
                return this._agendaOptionsView;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "calendarOptionsView", {
            get: function () {
                if (!this._calendarOptionsView) {
                    this._calendarOptionsView = View.fromJQuery(this.findJQuery('#calendar-options'));
                }
                return this._calendarOptionsView;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "timezoneOptionsView", {
            get: function () {
                if (!this._timezoneOptionsView) {
                    this._timezoneOptionsView = View.fromJQuery(this.findJQuery('#timezone-options'));
                }
                return this._timezoneOptionsView;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "courseOptionsView", {
            get: function () {
                if (!this._courseOptionsView) {
                    this._courseOptionsView = View.fromJQuery(this.findJQuery('#course-options'));
                }
                return this._courseOptionsView;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "eventsVisibilityOptionsView", {
            get: function () {
                if (!this._eventsVisibilityOptionsView) {
                    this._eventsVisibilityOptionsView = View.fromJQuery(this.findJQuery('#hidden-options'));
                }
                return this._eventsVisibilityOptionsView;
            },
            enumerable: true,
            configurable: true
        });

        SettingsView.prototype.render = function () {
            this.renderCourseOptionsView();
            this.renderEventsVisibilityOptions();
            this.renderAgendaOptionsView();
            this.renderCalendarOptionsView();
            this.renderTimezoneOptionsView();
        };

        SettingsView.prototype.renderTimezoneOptionsView = function () {
            var _this = this;
            this.timezoneOptionsView.removeAllChildren();
            var timezoneSegmentedControl = new SegmentedControlSingleSelectView();
            timezoneSegmentedControl.title = "Timezone";
            timezoneSegmentedControl.choices = [
                {
                    identifier: 'princeton',
                    displayText: 'Princeton\'s Timezone',
                    selected: !this.isLocalTimezone
                },
                {
                    identifier: 'local',
                    displayText: 'Local Timezone',
                    selected: this.isLocalTimezone
                }
            ];
            timezoneSegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, function (ev) {
                var choice = timezoneSegmentedControl.choices.reduce(function (selected, choice) {
                    if (selected === null && choice.selected) {
                        return choice;
                    }
                    return selected;
                }, null);
                _this.isLocalTimezone = choice.identifier === 'local';
            });
            this.timezoneOptionsView.append(timezoneSegmentedControl);
        };
        SettingsView.prototype.renderCalendarOptionsView = function () {
            var _this = this;
            this.calendarOptionsView.removeAllChildren();
            var calendarVisibilitySegmentedControl = new SegmentedControlMultipleSelectView();
            calendarVisibilitySegmentedControl.title = "Show these in calendar:";
            calendarVisibilitySegmentedControl.choices = this.possibleEventTypes.allKeys().map(function (eventTypeCode) {
                return {
                    identifier: eventTypeCode,
                    displayText: _this.possibleEventTypes.get(eventTypeCode),
                    selected: _this.calendarSelectedEventTypesSet.contains(eventTypeCode)
                };
            });
            calendarVisibilitySegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, function (ev) {
                var choices = calendarVisibilitySegmentedControl.choices;
                _this._calendarSelectedEventTypes = choices.reduce(function (selected, choice) {
                    if (choice.selected) {
                        selected.add(choice.identifier);
                    }
                    return selected;
                }, new Set());
            });
            this.calendarOptionsView.append(calendarVisibilitySegmentedControl);
        };

        SettingsView.prototype.renderAgendaOptionsView = function () {
            var _this = this;
            this.agendaOptionsView.removeAllChildren();
            var agendaVisibilitySegmentedControl = new SegmentedControlMultipleSelectView();
            agendaVisibilitySegmentedControl.title = "Show these in agenda:";
            agendaVisibilitySegmentedControl.choices = this.possibleEventTypes.allKeys().map(function (eventTypeCode) {
                return {
                    identifier: eventTypeCode,
                    displayText: _this.possibleEventTypes.get(eventTypeCode),
                    selected: _this.agendaSelectedEventTypesSet.contains(eventTypeCode)
                };
            });
            agendaVisibilitySegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, function (ev) {
                var choices = agendaVisibilitySegmentedControl.choices;
                _this._agendaSelectedEventTypes = choices.reduce(function (selected, choice) {
                    if (choice.selected) {
                        selected.add(choice.identifier);
                    }
                    return selected;
                }, new Set());
            });
            this.agendaOptionsView.append(agendaVisibilitySegmentedControl);
        };

        SettingsView.prototype.renderCourseOptionsView = function () {
            var _this = this;
            this.courseOptionsView.removeAllChildren();
            var courseVisibilitySegmentedControl = new SegmentedControlMultipleSelectView();
            courseVisibilitySegmentedControl.title = 'Visible Courses';
            courseVisibilitySegmentedControl.choices = this.possibleCourses.map(function (course) {
                return {
                    identifier: course.courseId,
                    displayText: course.primaryListing,
                    selected: _this.visibleCoursesSet.contains(course)
                };
            });
            courseVisibilitySegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, function (ev, extra) {
                var choices = courseVisibilitySegmentedControl.choices;
                _this._visibleCourses = new Set(_this.possibleCourses.filter(function (course) {
                    return choices.filter(function (choice) {
                        return choice.identifier === course.courseId && choice.selected;
                    }).length !== 0;
                }));
            });
            this.courseOptionsView.append(courseVisibilitySegmentedControl);
        };

        SettingsView.prototype.renderEventsVisibilityOptions = function () {
            var _this = this;
            this.eventsVisibilityOptionsView.removeAllChildren();
            var eventsVisibilitySegmentedControl = new SegmentedControlSingleSelectView();
            eventsVisibilitySegmentedControl.title = 'Show hidden events';
            eventsVisibilitySegmentedControl.choices = [
                {
                    identifier: 'yes',
                    displayText: 'Yes',
                    selected: this.eventsHidden
                },
                {
                    identifier: 'no',
                    displayText: 'No',
                    selected: !this.eventsHidden
                }
            ];
            eventsVisibilitySegmentedControl.attachEventHandler(BrowserEvents.segmentedControlSelectionChange, function (ev, extra) {
                eventsVisibilitySegmentedControl.choices.filter(function (choice) {
                    return choice.selected;
                }).map(function (choice) {
                    _this.eventsHidden = (choice.identifier === 'yes');
                });
            });
            this.eventsVisibilityOptionsView.append(eventsVisibilitySegmentedControl);
        };
        return SettingsView;
    })(View);

    
    return SettingsView;
});
//# sourceMappingURL=SettingsView.js.map

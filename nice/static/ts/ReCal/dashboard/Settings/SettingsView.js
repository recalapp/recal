/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/SegmentedControl/SegmentedControlMultipleSelectView', '../../../library/SegmentedControl/SegmentedControlSingleSelectView', '../../../library/DataStructures/Set', '../../../library/CoreUI/View'], function(require, exports, BrowserEvents, SegmentedControlMultipleSelectView, SegmentedControlSingleSelectView, Set, View) {
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
                    this._possibleEventTypes = new Set();
                }
                return this._possibleEventTypes.toArray();
            },
            set: function (value) {
                if (value === null || value === undefined) {
                    value = [];
                }
                this._possibleEventTypes = new Set(value);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "agendaSelectedEventTypes", {
            get: function () {
                if (!this._agendaSelectedEventTypes) {
                    this._agendaSelectedEventTypes = new Set();
                }
                return this._agendaSelectedEventTypes.toArray();
            },
            set: function (value) {
                if (value === null || value === undefined) {
                    value = [];
                }
                this._agendaSelectedEventTypes = new Set(value);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SettingsView.prototype, "calendarSelectedEventTypes", {
            get: function () {
                if (!this._calendarSelectedEventTypes) {
                    this._calendarSelectedEventTypes = new Set();
                }
                return this._calendarSelectedEventTypes.toArray();
            },
            set: function (value) {
                if (value === null || value === undefined) {
                    value = [];
                }
                this._calendarSelectedEventTypes = new Set(value);
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
                _this.visibleCourses = _this.possibleCourses.filter(function (course) {
                    return choices.filter(function (choice) {
                        return choice.identifier === course.courseId && choice.selected;
                    }).length !== 0;
                });
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

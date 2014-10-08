/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/SegmentedControl/SegmentedControlSingleSelectView', '../../../library/DataStructures/Set', '../../../library/CoreUI/View'], function(require, exports, SegmentedControlSingleSelectView, Set, View) {
    var SettingsView = (function (_super) {
        __extends(SettingsView, _super);
        /***************************************************************************
        * Methods
        **************************************************************************/
        function SettingsView($element, cssClass) {
            _super.call(this, $element, cssClass);
            this._possibleEventTypes = null;
            this._agendaSelectedEventTypes = null;
            this._calendarSelectedEventTypes = null;
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
            this.eventsVisibilityOptionsView.removeAllChildren();
            var eventsVisibilitySegmentedControl = new SegmentedControlSingleSelectView();
            eventsVisibilitySegmentedControl.title = 'Show hidden events';
            eventsVisibilitySegmentedControl.choices = [
                {
                    identifier: 'yes',
                    displayText: 'Yes',
                    selected: true
                },
                {
                    identifier: 'no',
                    displayText: 'No',
                    selected: false
                }
            ];
            this.eventsVisibilityOptionsView.append(eventsVisibilitySegmentedControl);
        };
        return SettingsView;
    })(View);

    
    return SettingsView;
});
//# sourceMappingURL=SettingsView.js.map

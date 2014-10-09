/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../library/Calendar/CalendarView', './NiceCalendar/NiceCalendarViewController', '../common/Events/EventsOperationsFacade', '../../library/Core/GlobalBrowserEventsManager', '../../library/CoreUI/ViewController', '../../library/CoreUI/ViewTemplateRetriever'], function(require, exports, CalendarView, NiceCalendarViewController, EventsOperationsFacade, GlobalBrowserEventsManager, ViewController, ViewTemplateRetriever) {
    var NiceViewController = (function (_super) {
        __extends(NiceViewController, _super);
        function NiceViewController(view) {
            _super.call(this, view);
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            /**
            * View template retriever
            */
            this._viewTemplateRetriever = null;
            /**
            * Events Operations Facade
            */
            this._eventsOperationsFacade = null;
            /**
            * Calendar view controller
            */
            this._calendarViewController = null;
            this.initialize();
        }
        Object.defineProperty(NiceViewController.prototype, "globalBrowserEventsManager", {
            get: function () {
                if (!this._globalBrowserEventsManager) {
                    this._globalBrowserEventsManager = new GlobalBrowserEventsManager();
                }
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(NiceViewController.prototype, "viewTemplateRetriever", {
            get: function () {
                if (!this._viewTemplateRetriever) {
                    this._viewTemplateRetriever = new ViewTemplateRetriever();
                }
                return this._viewTemplateRetriever;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(NiceViewController.prototype, "eventsOperationsFacade", {
            get: function () {
                if (!this._eventsOperationsFacade) {
                    this._eventsOperationsFacade = new EventsOperationsFacade({
                        globalBrowserEventsManager: this.globalBrowserEventsManager
                    });
                }
                return this._eventsOperationsFacade;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(NiceViewController.prototype, "calendarViewController", {
            get: function () {
                return this._calendarViewController;
            },
            set: function (value) {
                this._calendarViewController = value;
            },
            enumerable: true,
            configurable: true
        });


        NiceViewController.prototype.initialize = function () {
            this.initializeCalendar();
        };

        NiceViewController.prototype.initializeCalendar = function () {
            // initialize calendar view
            var calendarView = CalendarView.fromJQuery(this.view.findJQuery('#calendarui'));
            var calendarVC = new NiceCalendarViewController(calendarView, {
                eventsOperationsFacade: this.eventsOperationsFacade
            });
            this.addChildViewController(calendarVC);
            this.calendarViewController = calendarVC;
        };
        return NiceViewController;
    })(ViewController);

    
    return NiceViewController;
});

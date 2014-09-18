/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/Core/EncodeDecodeProxy', '../../../library/CoreUI/FocusableView', '../../../library/PopUp/PopUpView', '../GlobalInstancesManager', '../ReCalCommonBrowserEvents'], function(require, exports, BrowserEvents, EncodeDecodeProxy, FocusableView, PopUpView, GlobalInstancesManager, ReCalCommonBrowserEvents) {
    var EventsPopUpView = (function (_super) {
        __extends(EventsPopUpView, _super);
        function EventsPopUpView() {
            var _this = this;
            _super.call(this, GlobalInstancesManager.instance.viewTemplateRetriever.retrieveTemplate('#popup-template'), EventsPopUpView.cssClass);
            this._eventsModel = null;
            this._title = null;
            this._description = null;
            this._location = null;
            this._sectionId = null;
            this._eventTypeCode = null;
            this._startDate = null;
            this._endDate = null;
            this._lastEdited = null;
            this._closeButton = null;

            // TODO set up buttons
            // set up close button
            this._closeButton = FocusableView.fromJQuery(this.findJQuery('#close_button'));
            this.closeButton.attachEventHandler(BrowserEvents.click, function (ev) {
                _this.triggerEvent(ReCalCommonBrowserEvents.popUpShouldClose);
            });
        }
        Object.defineProperty(EventsPopUpView.prototype, "eventsModel", {
            get: function () {
                return this._eventsModel;
            },
            set: function (value) {
                if (this._eventsModel !== value) {
                    this._eventsModel = value;
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (value) {
                if (this._title === value) {
                    return;
                }
                this._title = value;
                if (this._title === null || this._title === undefined) {
                    return;
                }
                this.findJQuery('#popup-title').text(this._title);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "description", {
            get: function () {
                return this._description;
            },
            set: function (value) {
                if (this._description === value) {
                    return;
                }
                this._description = value;
                if (this._description === null || this._description === undefined) {
                    return;
                }
                var proxy = EncodeDecodeProxy.instance;
                this.findJQuery('#popup-desc').html(proxy.newLinesToBr(proxy.htmlEncode(this._description)));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "location", {
            get: function () {
                return this._location;
            },
            set: function (value) {
                if (this._location === value) {
                    return;
                }
                this._location = value;
                if (this._location === null || this._location === undefined) {
                    return;
                }
                this.findJQuery('#popup-loc').text(this._location);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "sectionId", {
            get: function () {
                return this._sectionId;
            },
            set: function (value) {
                if (this._sectionId === value) {
                    return;
                }
                this._sectionId = value;
                if (this._sectionId === null || this._sectionId === undefined) {
                    return;
                }
                this.findJQuery('#popup-section').text(SECTION_MAP[this._sectionId]);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "eventTypeCode", {
            get: function () {
                return this._eventTypeCode;
            },
            set: function (value) {
                // TODO to title case
                if (this._eventTypeCode === value) {
                    return;
                }
                this._eventTypeCode = value;
                if (this._eventTypeCode === null || this._eventTypeCode === undefined) {
                    return;
                }
                this.findJQuery('#popup-type').text(TYPE_MAP[this._eventTypeCode]);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "startDate", {
            get: function () {
                return this._startDate;
            },
            set: function (value) {
                if (this._startDate && this._startDate.equals(value)) {
                    return;
                }
                this._startDate = value;
                if (this._startDate === null || this._startDate === undefined) {
                    return;
                }
                this.findJQuery('#popup-date').text(this._startDate.format('MMMM D, YYYY'));
                this.findJQuery('#popup-time-start').text(this._startDate.format('h:mm A'));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "endDate", {
            get: function () {
                return this._endDate;
            },
            set: function (value) {
                if (this._endDate && this._endDate.equals(value)) {
                    return;
                }
                this._endDate = value;
                if (this._endDate === null || this._endDate === undefined) {
                    return;
                }
                this.findJQuery('#popup-time-end').text(this._endDate.format('h:mm A'));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "lastEdited", {
            get: function () {
                return this._lastEdited;
            },
            set: function (value) {
                if (this._lastEdited && this._lastEdited.equals(value)) {
                    return;
                }
                this._lastEdited = value;
                if (this._lastEdited === null || this._lastEdited === undefined) {
                    return;
                }
                this.findJQuery('#popup-last-edited-time').text(this._lastEdited.format('MM/DD/YYYY'));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView, "cssClass", {
            get: function () {
                return PopUpView.cssClass + ' eventsPopUpView';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "closeButton", {
            get: function () {
                return this._closeButton;
            },
            enumerable: true,
            configurable: true
        });

        // can be overridden in subclasses
        EventsPopUpView.prototype.refresh = function () {
            if (this.eventsModel === null || this.eventsModel === undefined) {
                return;
            }

            this.title = this.eventsModel.title;
            this.description = this.eventsModel.description;
            this.sectionId = this.eventsModel.sectionId;
            this.eventTypeCode = this.eventsModel.eventTypeCode;
            this.startDate = this.eventsModel.startDate;
            this.endDate = this.eventsModel.endDate;
            this.lastEdited = this.eventsModel.lastEdited;
        };
        return EventsPopUpView;
    })(PopUpView);

    
    return EventsPopUpView;
});

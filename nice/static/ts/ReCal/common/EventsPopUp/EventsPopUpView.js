/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/Core/EncodeDecodeProxy', '../../../library/CoreUI/FocusableView', '../../../library/PopUp/PopUpView', '../ReCalCommonBrowserEvents'], function(require, exports, BrowserEvents, EncodeDecodeProxy, FocusableView, PopUpView, ReCalCommonBrowserEvents) {
    var EventsPopUpView = (function (_super) {
        __extends(EventsPopUpView, _super);
        function EventsPopUpView(dependencies) {
            var _this = this;
            _super.call(this, dependencies.viewTemplateRetriever.retrieveTemplate('#popup-template'), EventsPopUpView.cssClass);
            this._encodeDecodeProxy = new EncodeDecodeProxy();
            this._eventsModel = null;
            this._title = null;
            this._titleJQuery = null;
            this._description = null;
            this._descriptionJQuery = null;
            this._location = null;
            this._locationJQuery = null;
            this._sectionId = null;
            this._sectionJQuery = null;
            this._eventTypeCode = null;
            this._eventTypeJQuery = null;
            this._startDate = null;
            this._dateJQuery = null;
            this._startTimeJQuery = null;
            this._endDate = null;
            this._endTimeJQuery = null;
            this._lastEdited = null;
            this._lastEditedJQuery = null;
            this._closeButton = null;

            // TODO set up buttons
            // set up close button
            this._closeButton = FocusableView.fromJQuery(this.findJQuery('#close-button'));
            this.closeButton.attachEventHandler(BrowserEvents.click, function (ev) {
                _this.triggerEvent(ReCalCommonBrowserEvents.popUpShouldClose);
            });
        }
        Object.defineProperty(EventsPopUpView.prototype, "encodeDecodeProxy", {
            get: function () {
                return this._encodeDecodeProxy;
            },
            enumerable: true,
            configurable: true
        });

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
                this.titleJQuery.text(this._title);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "titleJQuery", {
            get: function () {
                if (!this._titleJQuery) {
                    this._titleJQuery = this.findJQuery('#popup-title');
                }
                return this._titleJQuery;
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
                this.descriptionJQuery.html(this.encodeDecodeProxy.newLinesToBr(this.encodeDecodeProxy.htmlEncode(this._description)));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "descriptionJQuery", {
            get: function () {
                if (!this._descriptionJQuery) {
                    this._descriptionJQuery = this.findJQuery('#popup-desc');
                }
                return this._descriptionJQuery;
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
                this.locationJQuery.text(this._location);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "locationJQuery", {
            get: function () {
                if (!this._locationJQuery) {
                    this._locationJQuery = this.findJQuery('#popup-loc');
                }
                return this._locationJQuery;
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
                this.sectionJQuery.text(SECTION_MAP[this._sectionId]);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "sectionJQuery", {
            get: function () {
                if (!this._sectionJQuery) {
                    this._sectionJQuery = this.findJQuery('#popup-section');
                }
                return this._sectionJQuery;
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
                this.eventTypeJQuery.text(TYPE_MAP[this._eventTypeCode]);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "eventTypeJQuery", {
            get: function () {
                if (!this._eventTypeJQuery) {
                    this._eventTypeJQuery = this.findJQuery('#popup-type');
                }
                return this._eventTypeJQuery;
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
                this.dateJQuery.text(this._startDate.format('MMMM D, YYYY'));
                this.startTimeJQuery.text(this._startDate.format('h:mm A'));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "dateJQuery", {
            get: function () {
                if (!this._dateJQuery) {
                    this._dateJQuery = this.findJQuery('#popup-date');
                }
                return this._dateJQuery;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "startTimeJQuery", {
            get: function () {
                if (!this._startTimeJQuery) {
                    this._startTimeJQuery = this.findJQuery('#popup-time-start');
                }
                return this._startTimeJQuery;
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
                this.endTimeJQuery.text(this._endDate.format('h:mm A'));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "endTimeJQuery", {
            get: function () {
                if (!this._endTimeJQuery) {
                    this._endTimeJQuery = this.findJQuery('#popup-time-end');
                }
                return this._endTimeJQuery;
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
                this.lastEditedJQuery.text(this._lastEdited.format('MM/DD/YYYY'));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "lastEditedJQuery", {
            get: function () {
                if (!this._lastEditedJQuery) {
                    this._lastEditedJQuery = this.findJQuery('#popup-last-edited-time');
                }
                return this._lastEditedJQuery;
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

        EventsPopUpView.prototype.refresh = function () {
            this.refreshWithEventsModel(this.eventsModel);
        };

        // can be overridden in subclasses
        EventsPopUpView.prototype.refreshWithEventsModel = function (eventsModel) {
            if (eventsModel === null || eventsModel === undefined) {
                return;
            }

            this.title = eventsModel.title;
            this.description = eventsModel.description;
            this.sectionId = eventsModel.sectionId;
            this.eventTypeCode = eventsModel.eventTypeCode;
            this.startDate = eventsModel.startDate;
            this.endDate = eventsModel.endDate;
            this.lastEdited = eventsModel.lastEdited;
        };
        return EventsPopUpView;
    })(PopUpView);

    
    return EventsPopUpView;
});

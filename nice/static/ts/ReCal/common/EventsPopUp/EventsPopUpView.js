/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/EncodeDecodeProxy', '../../../library/PopUp/PopUpView', '../GlobalInstancesManager'], function(require, exports, EncodeDecodeProxy, PopUpView, GlobalInstancesManager) {
    var EventsPopUpView = (function (_super) {
        __extends(EventsPopUpView, _super);
        function EventsPopUpView() {
            _super.call(this, GlobalInstancesManager.instance.viewTemplateRetriever.retrieveTemplate('#popup-template'), EventsPopUpView.cssClass);
            this._eventId = null;
            this._title = null;
            this._description = null;
            this._location = null;
            this._section = null;
            this._eventType = null;
            this._startDate = null;
            this._endDate = null;
            this._lastEdited = null;
            // TODO set up buttons
        }
        Object.defineProperty(EventsPopUpView.prototype, "eventId", {
            get: function () {
                return this._eventId;
            },
            set: function (value) {
                if (value !== this._eventId) {
                    this._eventId = value;
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

        Object.defineProperty(EventsPopUpView.prototype, "section", {
            get: function () {
                return this._section;
            },
            set: function (value) {
                if (this._section === value) {
                    return;
                }
                this._section = value;
                if (this._section === null || this._section === undefined) {
                    return;
                }
                this.findJQuery('#popup-section').text(SECTION_MAP[this._section]);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpView.prototype, "eventType", {
            get: function () {
                return this._eventType;
            },
            set: function (value) {
                // TODO to title case
                if (this._eventType === value) {
                    return;
                }
                this._eventType = value;
                if (this._eventType === null || this._eventType === undefined) {
                    return;
                }
                this.findJQuery('#popup-type').text(TYPE_MAP[this._eventType]);
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

        EventsPopUpView.prototype.refresh = function () {
        };
        return EventsPopUpView;
    })(PopUpView);

    
    return EventsPopUpView;
});

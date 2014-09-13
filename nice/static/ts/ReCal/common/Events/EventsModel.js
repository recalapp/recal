define(["require", "exports"], function(require, exports) {
    // when we support todos in addition to events, this class will become a base class (?)
    var EventsModel = (function () {
        function EventsModel(arg) {
            this._eventId = null;
            this._title = null;
            this._description = null;
            this._location = null;
            this._sectionId = null;
            this._eventTypeCode = null;
            this._startDate = null;
            this._endDate = null;
            this._lastEdited = null;
            this.eventId = arg.eventId;
            this.title = arg.title;
            this.description = arg.description;
            this.sectionId = arg.sectionId;
            this.eventTypeCode = arg.eventTypeCode;
            this.startDate = arg.startDate;
            this.endDate = arg.endDate;
            this.lastEdited = arg.lastEdited;
        }
        Object.defineProperty(EventsModel.prototype, "eventId", {
            get: function () {
                return this._eventId;
            },
            set: function (value) {
                this._eventId = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (value) {
                this._title = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "description", {
            get: function () {
                return this._description;
            },
            set: function (value) {
                this._description = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "location", {
            get: function () {
                return this._location;
            },
            set: function (value) {
                this._location = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "sectionId", {
            get: function () {
                return this._sectionId;
            },
            set: function (value) {
                this._sectionId = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "eventTypeCode", {
            get: function () {
                return this._eventTypeCode;
            },
            set: function (value) {
                this._eventTypeCode = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "startDate", {
            get: function () {
                return this._startDate;
            },
            set: function (value) {
                this._startDate = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "endDate", {
            get: function () {
                return this._endDate;
            },
            set: function (value) {
                this._endDate = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "lastEdited", {
            get: function () {
                return this._lastEdited;
            },
            set: function (value) {
                this._lastEdited = value;
            },
            enumerable: true,
            configurable: true
        });
        return EventsModel;
    })();

    
    return EventsModel;
});

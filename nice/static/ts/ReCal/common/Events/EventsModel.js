define(["require", "exports", '../../../library/DateTime/DateTime'], function(require, exports, DateTime) {
    // when we support todos in addition to events, this class will become a base class (?)
    var EventsModel = (function () {
        function EventsModel(arg) {
            this._eventId = null;
            this._title = null;
            this._description = null;
            this._location = null;
            this._sectionId = null;
            this._courseId = null;
            this._eventTypeCode = null;
            this._startDate = null;
            this._endDate = null;
            this._lastEdited = null;
            this._eventGroupId = null;
            this._sectionColor = null;
            this._revisionId = null;
            this.eventId = arg.eventId;
            this.title = arg.title;
            this.description = arg.description;
            this.location = arg.location;
            this.sectionId = arg.sectionId;
            this.eventTypeCode = arg.eventTypeCode;
            this.startDate = new DateTime(arg.startDate);
            this.endDate = new DateTime(arg.endDate);
            this.lastEdited = new DateTime(arg.lastEdited);
            this.eventGroupId = arg.eventGroupId;
            this.sectionColor = arg.sectionColor;
            this.revisionId = arg.sectionId;
            this.courseId = arg.courseId;
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


        Object.defineProperty(EventsModel.prototype, "courseId", {
            get: function () {
                return this._courseId;
            },
            set: function (value) {
                this._courseId = value;
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


        Object.defineProperty(EventsModel.prototype, "eventGroupId", {
            get: function () {
                return this._eventGroupId;
            },
            set: function (value) {
                this._eventGroupId = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "sectionColor", {
            get: function () {
                return this._sectionColor;
            },
            set: function (value) {
                this._sectionColor = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsModel.prototype, "revisionId", {
            get: function () {
                return this._revisionId;
            },
            set: function (value) {
                this._revisionId = value;
            },
            enumerable: true,
            configurable: true
        });
        return EventsModel;
    })();

    
    return EventsModel;
});
//# sourceMappingURL=EventsModel.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../Events/EventsModel', './EventsPopUpView'], function(require, exports, BrowserEvents, EventsModel, EventsPopUpView) {
    var EditableEventsPopUpView = (function (_super) {
        __extends(EditableEventsPopUpView, _super);
        function EditableEventsPopUpView(dependencies) {
            _super.call(this, dependencies);
            this._modifiedEventsModel = null;
            this.initialize();
        }
        Object.defineProperty(EditableEventsPopUpView.prototype, "modifiedEventsModel", {
            get: function () {
                return this._modifiedEventsModel;
            },
            set: function (value) {
                this._modifiedEventsModel = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EditableEventsPopUpView.prototype, "eventsModel", {
            set: function (value) {
                if (this._eventsModel !== value) {
                    this._eventsModel = value;
                    this.modifiedEventsModel = new EventsModel(this._eventsModel);
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });

        EditableEventsPopUpView.prototype.initialize = function () {
            var _this = this;
            this.attachEventHandler(BrowserEvents.clickToEditComplete, function (ev, extra) {
                var result = extra.value.trim();
                var view = extra.view;
                if (view.is(_this.titleJQuery)) {
                } else if (view.is(_this.descriptionJQuery)) {
                } else if (view.is(_this.locationJQuery)) {
                } else if (view.is(_this.sectionJQuery)) {
                } else if (view.is(_this.eventTypeJQuery)) {
                } else if (view.is(_this.dateJQuery)) {
                } else if (view.is(_this.startTimeJQuery)) {
                } else if (view.is(_this.endTimeJQuery)) {
                }
            });
        };

        EditableEventsPopUpView.prototype.refresh = function () {
            this.refreshWithEventsModel(this.modifiedEventsModel);
            if (this.modifiedEventsModel.title !== this.eventsModel.title) {
            }
            if (this.modifiedEventsModel.description !== this.eventsModel.description) {
            }
            if (this.modifiedEventsModel.sectionId !== this.eventsModel.sectionId) {
            }
            if (this.modifiedEventsModel.eventTypeCode !== this.eventsModel.eventTypeCode) {
            }
            if (this.modifiedEventsModel.startDate !== this.eventsModel.startDate) {
            }
            if (this.modifiedEventsModel.endDate !== this.eventsModel.endDate) {
            }
        };
        return EditableEventsPopUpView;
    })(EventsPopUpView);
    
    return EditableEventsPopUpView;
});

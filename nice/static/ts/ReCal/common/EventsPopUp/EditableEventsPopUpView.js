var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/BrowserEvents', '../../../library/ClickToEdit/ClickToEditSelectView', '../../../library/Core/ComparableResult', '../Events/EventsModel', './EventsPopUpView', '../../../library/CoreUI/FocusableView', '../ReCalCommonBrowserEvents'], function(require, exports, BrowserEvents, ClickToEditSelectView, ComparableResult, EventsModel, EventsPopUpView, FocusableView, ReCalCommonBrowserEvents) {
    var EditableEventsPopUpView = (function (_super) {
        __extends(EditableEventsPopUpView, _super);
        function EditableEventsPopUpView($element, cssClass, dependencies) {
            _super.call(this, $element, cssClass);
            this.HIGHLIGHTED_CLASS = 'highlighted';
            this._modifiedEventsModel = null;
            this._isModified = null;
            this._saveButton = null;
            this._clickToEditViewFactory = null;
            this._clickToEditViewFactory = dependencies.clickToEditViewFactory;
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


        Object.defineProperty(EditableEventsPopUpView.prototype, "possibleSections", {
            get: function () {
                return this._possibleSections;
            },
            set: function (value) {
                this._possibleSections = value;
                var sectionView = ClickToEditSelectView.fromJQuery(this.sectionJQuery);
                sectionView.selectOptions = this._possibleSections.map(function (sectionsModel, index) {
                    return {
                        value: sectionsModel.sectionId,
                        displayText: sectionsModel.coursesModel.primaryListing + ' - ' + sectionsModel.title
                    };
                });
                // TODO add listener for when section changes, important for when page loads slowly and this is not yet loaded.
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(EditableEventsPopUpView.prototype, "possibleEventTypes", {
            get: function () {
                return this._possibleEventTypes;
            },
            set: function (value) {
                var _this = this;
                this._possibleEventTypes = value;
                var eventTypeView = ClickToEditSelectView.fromJQuery(this.eventTypeJQuery);
                eventTypeView.selectOptions = this._possibleEventTypes.allKeys().map(function (eventTypeCode) {
                    return {
                        value: eventTypeCode,
                        displayText: _this._possibleEventTypes.get(eventTypeCode)
                    };
                });
                // TODO add listener for when event type changes
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(EditableEventsPopUpView.prototype, "isModified", {
            get: function () {
                return this._isModified;
            },
            set: function (value) {
                if (this._isModified !== value) {
                    this._isModified = value;
                    this.saveButton.viewIsHidden = !value;
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(EditableEventsPopUpView.prototype, "saveButton", {
            get: function () {
                return this._saveButton;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EditableEventsPopUpView.prototype, "clickToEditViewFactory", {
            get: function () {
                return this._clickToEditViewFactory;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EditableEventsPopUpView.prototype, "eventsModel", {
            // if overwrite set, must also overwrite get
            get: function () {
                return this._eventsModel;
            },
            set: function (value) {
                if (this._eventsModel !== value) {
                    this._eventsModel = value;
                    this.modifiedEventsModel = new EventsModel(this._eventsModel);
                    this.isModified = false;
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });


        EditableEventsPopUpView.prototype.initialize = function () {
            var _this = this;
            // initialize save button
            this._saveButton = FocusableView.fromJQuery(this.findJQuery('#save_button'));
            this.saveButton.attachEventHandler(BrowserEvents.click, function (ev, extra) {
                _this.triggerEvent(ReCalCommonBrowserEvents.editablePopUpDidSave, {
                    modifiedEventsModel: _this.modifiedEventsModel
                });
                _this.eventsModel = _this.modifiedEventsModel; // TODO do this here?
            });

            // initialize click to edit
            this.findJQuery('.clickToEdit').each(function (index, element) {
                var $element = $(element);
                var clickToEditView = _this.clickToEditViewFactory.createFromJQuery($element);
            });

            // add event handler for click to edit
            this.attachEventHandler(BrowserEvents.clickToEditComplete, function (ev, extra) {
                var result = extra.value.trim();
                var view = extra.view;

                // if we reach this point, assume result is valid.
                if (view.is(_this.titleJQuery)) {
                    _this.processModifiedTitle(result);
                } else if (view.is(_this.descriptionJQuery)) {
                    _this.processModifiedDescription(result);
                } else if (view.is(_this.locationJQuery)) {
                    _this.processModifiedLocation(result);
                } else if (view.is(_this.sectionJQuery)) {
                    _this.processModifiedSection();
                } else if (view.is(_this.eventTypeJQuery)) {
                    _this.processModifiedEventType();
                } else if (view.is(_this.dateJQuery)) {
                    _this.processModifiedDate();
                } else if (view.is(_this.startTimeJQuery)) {
                    _this.processModifiedStartTime();
                } else if (view.is(_this.endTimeJQuery)) {
                    _this.processModifiedEndTime();
                }
                _this.refresh();
            });
        };

        EditableEventsPopUpView.prototype.processModifiedTitle = function (value) {
            if (value !== this.modifiedEventsModel.title) {
                this.modifiedEventsModel.title = value;
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.processModifiedDescription = function (value) {
            if (value !== this.modifiedEventsModel.description) {
                this.modifiedEventsModel.description = value;
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.processModifiedLocation = function (value) {
            if (value !== this.modifiedEventsModel.location) {
                this.modifiedEventsModel.location = value;
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.processModifiedSection = function () {
            this.modifiedEventsModel.sectionId = this.sectionJQuery.data('logical_value');
            if (this.modifiedEventsModel.sectionId !== this.eventsModel.sectionId) {
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.processModifiedEventType = function () {
            this.modifiedEventsModel.eventTypeCode = this.eventTypeJQuery.data('logical_value');
            if (this.modifiedEventsModel.eventTypeCode !== this.eventsModel.eventTypeCode) {
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.processModifiedStartTime = function () {
            var value = this.startTimeJQuery.data('logical_value');
            this.modifiedEventsModel.startDate.hours = value.hours;
            this.modifiedEventsModel.startDate.minutes = value.minutes;
            if (this.modifiedEventsModel.startDate.compareTo(this.eventsModel.startDate) !== 0 /* equal */) {
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.processModifiedEndTime = function () {
            var value = this.endTimeJQuery.data('logical_value');
            this.modifiedEventsModel.endDate.hours = value.hours;
            this.modifiedEventsModel.endDate.minutes = value.minutes;
            if (this.modifiedEventsModel.endDate.compareTo(this.eventsModel.endDate) !== 0 /* equal */) {
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.processModifiedDate = function () {
            var value = this.dateJQuery.data('logical_value');
            this.modifiedEventsModel.startDate.year = value.year;
            this.modifiedEventsModel.startDate.month = value.month;
            this.modifiedEventsModel.startDate.date = value.date;
            this.modifiedEventsModel.endDate.year = value.year;
            this.modifiedEventsModel.endDate.month = value.month;
            this.modifiedEventsModel.endDate.date = value.date;
            if (this.modifiedEventsModel.startDate.compareTo(this.eventsModel.startDate) !== 0 /* equal */) {
                this.isModified = true;
            }
        };

        EditableEventsPopUpView.prototype.refresh = function () {
            this.refreshWithEventsModel(this.modifiedEventsModel);
            if (this.modifiedEventsModel.title !== this.eventsModel.title) {
                this.titleJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.titleJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.description !== this.eventsModel.description) {
                this.descriptionJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.descriptionJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.location !== this.eventsModel.location) {
                this.locationJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.locationJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.sectionId !== this.eventsModel.sectionId) {
                this.sectionJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.sectionJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.eventTypeCode !== this.eventsModel.eventTypeCode) {
                this.eventTypeJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.eventTypeJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
            if (this.modifiedEventsModel.startDate.hours !== this.eventsModel.startDate.hours || this.modifiedEventsModel.startDate.minutes !== this.eventsModel.startDate.minutes) {
                this.startTimeJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.startTimeJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }

            if (this.modifiedEventsModel.startDate.year !== this.eventsModel.startDate.year || this.modifiedEventsModel.startDate.month !== this.eventsModel.startDate.month || this.modifiedEventsModel.startDate.date !== this.eventsModel.startDate.date) {
                this.dateJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.dateJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }

            if (this.modifiedEventsModel.endDate.hours !== this.eventsModel.endDate.hours || this.modifiedEventsModel.endDate.minutes !== this.eventsModel.endDate.minutes) {
                this.endTimeJQuery.addClass(this.HIGHLIGHTED_CLASS);
            } else {
                this.endTimeJQuery.removeClass(this.HIGHLIGHTED_CLASS);
            }
        };
        return EditableEventsPopUpView;
    })(EventsPopUpView);
    
    return EditableEventsPopUpView;
});
//# sourceMappingURL=EditableEventsPopUpView.js.map

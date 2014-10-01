define(["require", "exports", './EditableEventsPopUpView'], function(require, exports, EditableEventsPopUpView) {
    var EventsPopUpViewFactory = (function () {
        function EventsPopUpViewFactory(dependencies) {
            /**
            * View Template Retriever
            * @type {IViewTemplateRetriever}
            * @private
            */
            this._viewTemplateRetriever = null;
            /**
            * ClickToEditView Factory
            */
            this._clickToEditViewFactory = null;
            /**
            * The current logged in user, needed to get the list of sections
            * @type {IUserProfilesModel}
            * @private
            */
            this._user = null;
            this._clickToEditViewFactory = dependencies.clickToEditViewFactory;
            this._viewTemplateRetriever = dependencies.viewTemplateRetriever;
            this._user = dependencies.user;
        }
        Object.defineProperty(EventsPopUpViewFactory.prototype, "viewTemplateRetriever", {
            get: function () {
                return this._viewTemplateRetriever;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpViewFactory.prototype, "clickToEditViewFactory", {
            get: function () {
                return this._clickToEditViewFactory;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(EventsPopUpViewFactory.prototype, "user", {
            get: function () {
                return this._user;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Create a new events PopUp
        */
        EventsPopUpViewFactory.prototype.createEventsPopUp = function () {
            var eventsPopUpView = new EditableEventsPopUpView(this.viewTemplateRetriever.retrieveTemplate('#popup-template'), EditableEventsPopUpView.cssClass, {
                clickToEditViewFactory: this.clickToEditViewFactory
            });
            eventsPopUpView.possibleSections = this.user.enrolledSectionsModels;
            return eventsPopUpView;
        };
        return EventsPopUpViewFactory;
    })();

    
    return EventsPopUpViewFactory;
});
//# sourceMappingURL=EventsPopUpViewFactory.js.map

define(["require", "exports", './Events/EventsOperationsFacade', '../../library/Core/InvalidActionException', '../../library/Notifications/NotificationsManager', '../../library/CoreUI/ViewTemplateRetriever'], function(require, exports, EventsOperationsFacade, InvalidActionException, NotificationsManager, ViewTemplateRetriever) {
    /**
    * Used to hold objects that are not singletons but for which we want
    * a global instance. For example, events manager is not a singleton.
    * We can conceivably have cases where more than one events managers
    * exist, but for the purpose of this application, we would like access
    * to a single events manager
    */
    var GlobalInstancesManager = (function () {
        function GlobalInstancesManager() {
            /**
            * Notifications Manager
            */
            this._notificationsManager = null;
            /**
            * View template retriever
            */
            this._viewTemplateRetriever = null;
            /**
            * Events Manager
            */
            this._eventsOperationsFacade = null;
        }
        Object.defineProperty(GlobalInstancesManager, "instance", {
            get: function () {
                if (GlobalInstancesManager._instance === null || GlobalInstancesManager._instance === undefined) {
                    throw new InvalidActionException('GlobalInstancesManager is not yet initialized. Call registerGlobalInstancesManager(instance) first.');
                }
                return GlobalInstancesManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        GlobalInstancesManager.registerGlobalInstancesManager = function (instance) {
            if (GlobalInstancesManager._instance !== null && GlobalInstancesManager._instance !== undefined) {
                throw new InvalidActionException('GlobalInstancesManager is already initialized and cannot be initialized again');
            }
            if (instance === null || instance === undefined) {
                throw new InvalidActionException('The instance to register cannot be null or undefined');
            }
            GlobalInstancesManager._instance = instance;
        };

        GlobalInstancesManager.prototype.initialize = function () {
            this.notificationsManager = new NotificationsManager();
            this.viewTemplateRetriever = new ViewTemplateRetriever();
            this.eventsOperationsFacade = new EventsOperationsFacade();
        };

        Object.defineProperty(GlobalInstancesManager.prototype, "notificationsManager", {
            get: function () {
                return this._notificationsManager;
            },
            set: function (value) {
                this._notificationsManager = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(GlobalInstancesManager.prototype, "viewTemplateRetriever", {
            get: function () {
                return this._viewTemplateRetriever;
            },
            set: function (value) {
                this._viewTemplateRetriever = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(GlobalInstancesManager.prototype, "eventsOperationsFacade", {
            get: function () {
                return this._eventsOperationsFacade;
            },
            set: function (value) {
                this._eventsOperationsFacade = value;
            },
            enumerable: true,
            configurable: true
        });
        GlobalInstancesManager._instance = null;
        return GlobalInstancesManager;
    })();

    
    return GlobalInstancesManager;
});

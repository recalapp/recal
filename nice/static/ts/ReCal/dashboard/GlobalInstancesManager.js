define(["require", "exports"], function(require, exports) {
    /**
    * Used to hold objects that are not singletons but for which we want
    * a global instance. For example, events manager is not a singleton.
    * We can conceivably have cases where more than one events managers
    * exist, but for the purpose of this application, we would like access
    * to a single events manager
    */
    var GlobalInstancesManager = (function () {
        function GlobalInstancesManager() {
            this._notificationsManager = null;
        }
        Object.defineProperty(GlobalInstancesManager, "instance", {
            get: function () {
                if (GlobalInstancesManager._instance === null || GlobalInstancesManager._instance === undefined) {
                    GlobalInstancesManager._instance = new GlobalInstancesManager();
                }
                return GlobalInstancesManager._instance;
            },
            enumerable: true,
            configurable: true
        });

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
        GlobalInstancesManager._instance = null;
        return GlobalInstancesManager;
    })();

    
    return GlobalInstancesManager;
});

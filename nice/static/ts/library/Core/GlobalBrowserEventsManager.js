define(["require", "exports", "jquery", "../CoreUI/View"], function(require, exports, $, View) {
    var GlobalBrowserEventsManager = (function () {
        function GlobalBrowserEventsManager() {
            this._$globalParent = View.fromJQuery($(document));
        }
        Object.defineProperty(GlobalBrowserEventsManager, "instance", {
            get: function () {
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });

        GlobalBrowserEventsManager.prototype.attachGlobalEventHandler = function (ev, argumentTwo, handler) {
            this._$globalParent.attachEventHandler(ev, argumentTwo, handler);
        };
        GlobalBrowserEventsManager._instance = new GlobalBrowserEventsManager();
        return GlobalBrowserEventsManager;
    })();

    
    return GlobalBrowserEventsManager;
});

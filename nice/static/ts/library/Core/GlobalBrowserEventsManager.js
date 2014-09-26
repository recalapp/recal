define(["require", "exports", "jquery", "../CoreUI/View"], function(require, exports, $, View) {
    var GlobalBrowserEventsManager = (function () {
        function GlobalBrowserEventsManager() {
            this._$globalParent = View.fromJQuery($(document));
        }
        GlobalBrowserEventsManager.prototype.attachGlobalEventHandler = function (ev, argumentTwo, handler) {
            this._$globalParent.attachEventHandler(ev, argumentTwo, handler);
        };

        GlobalBrowserEventsManager.prototype.triggerEvent = function (ev, extraParameter) {
            this._$globalParent.triggerEvent(ev, extraParameter);
        };
        return GlobalBrowserEventsManager;
    })();

    
    return GlobalBrowserEventsManager;
});
//# sourceMappingURL=GlobalBrowserEventsManager.js.map

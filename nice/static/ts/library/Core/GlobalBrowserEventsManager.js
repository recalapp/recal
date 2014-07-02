var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "jquery", "../CoreUI/View", "./Singleton"], function(require, exports, $, View, Singleton) {
    var GlobalBrowserEventsManager = (function (_super) {
        __extends(GlobalBrowserEventsManager, _super);
        function GlobalBrowserEventsManager() {
            _super.apply(this, arguments);
            this._$globalParent = View.fromJQuery($(window));
        }
        GlobalBrowserEventsManager.initialize = function () {
            _super.prototype.initialize.call(this);
            this._instance = new GlobalBrowserEventsManager();
        };

        GlobalBrowserEventsManager.instance = function () {
            return _super.prototype.instance.call(this);
        };

        GlobalBrowserEventsManager.prototype.attachGlobalEventHandler = function (ev, argumentTwo, handler) {
            this._$globalParent.attachEventHandler(ev, argumentTwo, handler);
        };
        return GlobalBrowserEventsManager;
    })(Singleton);

    
    return GlobalBrowserEventsManager;
});

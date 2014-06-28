var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "jquery", "./BrowserEvents", "./InvalidArgumentException", "./Singleton"], function(require, exports, $, BrowserEvents, InvalidArgumentException, Singleton) {
    var BrowserEventsManager = (function (_super) {
        __extends(BrowserEventsManager, _super);
        function BrowserEventsManager() {
            _super.apply(this, arguments);
            this._$globalParent = $(window);
        }
        BrowserEventsManager.initialize = function () {
            _super.prototype.initialize.call(this);
            this._instance = new BrowserEventsManager;
        };

        BrowserEventsManager.prototype._getEventName = function (ev) {
            return BrowserEvents[BrowserEvents[ev]];
        };

        BrowserEventsManager.prototype.attachGlobalEventHandler = function (ev, argumentTwo, handler) {
            this.attachEventHandler(this._$globalParent, ev, argumentTwo, handler);
        };

        BrowserEventsManager.prototype.attachEventHandler = function ($element, ev, argumentThree, handler) {
            var eventName = this._getEventName(ev);
            if (typeof argumentThree === 'string' || argumentThree instanceof String || argumentThree.constructor === String) {
                if (handler === undefined) {
                    throw new InvalidArgumentException("No handler provided.");
                }
                $element.on(eventName, argumentThree, handler);
            } else if (typeof argumentThree === 'function') {
                $element.on(eventName, argumentThree);
            } else {
                throw new InvalidArgumentException("The second argument must either be a string or a function.");
            }
        };
        return BrowserEventsManager;
    })(Singleton);

    
    return BrowserEventsManager;
});

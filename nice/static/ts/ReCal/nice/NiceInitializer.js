/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', './NiceViewController', '../../library/CoreUI/View', "dashboard"], function(require, exports, $, NiceViewController, View) {
    var NiceInitializer = (function () {
        function NiceInitializer() {
            this._rootViewController = null;
        }
        Object.defineProperty(NiceInitializer.prototype, "rootViewController", {
            get: function () {
                return this._rootViewController;
            },
            set: function (value) {
                this._rootViewController = value;
            },
            enumerable: true,
            configurable: true
        });

        NiceInitializer.prototype.initialize = function () {
            // set up Nice View Controller
            var niceView = View.fromJQuery($('body'));
            var niceVC = new NiceViewController(niceView);

            this.rootViewController = niceVC;
            // TODO state restoration happens in this class?
        };
        return NiceInitializer;
    })();

    
    return NiceInitializer;
});

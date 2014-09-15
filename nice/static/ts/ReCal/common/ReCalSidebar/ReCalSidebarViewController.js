var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/CoreUI/ViewController'], function(require, exports, ViewController) {
    var ReCalSidebarViewController = (function (_super) {
        __extends(ReCalSidebarViewController, _super);
        function ReCalSidebarViewController(sidebarView) {
            _super.call(this, sidebarView);
        }
        Object.defineProperty(ReCalSidebarViewController.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Do any initialization needed. Better than overriding constructor
        * because this gives the option of not calling super.initialize();
        */
        ReCalSidebarViewController.prototype.initialize = function () {
        };
        return ReCalSidebarViewController;
    })(ViewController);
});

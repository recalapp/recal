var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './PopUpView', '../CoreUI/ViewController'], function(require, exports, $, PopUpView, ViewController) {
    var PopUpContainerViewController = (function (_super) {
        __extends(PopUpContainerViewController, _super);
        function PopUpContainerViewController() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(PopUpContainerViewController.prototype, "popUpViews", {
            /**
            * Returns all the PopUpViews in this container.
            */
            get: function () {
                return $.grep(this.view.children, function (childView, index) {
                    return childView.is(PopUpView.cssSelector());
                });
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Get the PopUpView with the specified ID.
        */
        PopUpContainerViewController.prototype.getPopUpById = function (popUpId) {
            var ret = null;
            $.each(this.popUpViews, function (index, popUpView) {
                if (popUpView.popUpId === popUpId) {
                    ret = popUpView;
                    return false;
                }
            });
            return ret;
        };
        return PopUpContainerViewController;
    })(ViewController);
    
    return PopUpContainerViewController;
});

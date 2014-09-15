var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Core/InvalidActionException', '../../../library/CoreUI/ViewController'], function(require, exports, InvalidActionException, ViewController) {
    var CanvasPopUpContainerViewController = (function (_super) {
        __extends(CanvasPopUpContainerViewController, _super);
        function CanvasPopUpContainerViewController() {
            _super.apply(this, arguments);
        }
        /**
        * Do any initialization needed. Better than overriding constructor
        * because this gives the option of not calling super.initialize();
        */
        CanvasPopUpContainerViewController.prototype.initialize = function () {
        };

        /**
        * Add a PopUpView object to the canvas container. PopUpView object
        * must be detached from its previous parent first
        */
        CanvasPopUpContainerViewController.prototype.addPopUpView = function (popUpView) {
            if (popUpView.parentView !== null) {
                throw new InvalidActionException("PopUpView must be detached before adding to container");
            }
            this.view.append(popUpView);
        };
        return CanvasPopUpContainerViewController;
    })(ViewController);

    
    return CanvasPopUpContainerViewController;
});

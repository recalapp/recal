define(["require", "exports", '../Core/InvalidActionException', '../DataStructures/Set'], function(require, exports, InvalidActionException, Set) {
    var ViewController = (function () {
        /******************************************************************
        Methods
        ****************************************************************/
        function ViewController(view) {
            this._view = null;
            this._parentViewController = null;
            this._childViewControllers = new Set();
            this._viewControllerNumber = ViewController._viewControllerCount++;
            this._view = view;
            this.initialize();
        }
        Object.defineProperty(ViewController.prototype, "view", {
            /******************************************************************
            Properties
            ****************************************************************/
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ViewController.prototype, "parentViewController", {
            get: function () {
                return this._parentViewController;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ViewController.prototype, "childViewControllers", {
            get: function () {
                return this._childViewControllers.toArray();
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Do any initialization needed. Better than overriding constructor
        * because this gives the option of not calling super.initialize();
        */
        ViewController.prototype.initialize = function () {
        };

        ViewController.prototype.addChildViewController = function (childVC) {
            if (this._childViewControllers.contains(childVC)) {
                throw new InvalidActionException('A child view controller can only be added once');
            }
            if (childVC._parentViewController != null) {
                throw new InvalidActionException('Child view controller already has a parent');
            }
            this._childViewControllers.add(childVC);
            childVC._parentViewController = this;
        };
        ViewController.prototype.removeFromParentViewController = function () {
            if (this._parentViewController === null) {
                throw new InvalidActionException('The view controller has no parents');
            }
            this._parentViewController._childViewControllers.remove(this);
            this._parentViewController = null;
        };
        ViewController.prototype.toString = function () {
            return 'View Controller no. ' + this._viewControllerNumber;
        };
        ViewController._viewControllerCount = 0;
        return ViewController;
    })();

    
    return ViewController;
});

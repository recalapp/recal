var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var View = (function () {
        /******************************************************************
        Methods
        ****************************************************************/
        function View($element) {
            this._children = new Array();
            this._$el = $element;
        }
        Object.defineProperty(View.prototype, "parentView", {
            get: function () {
                return this._parentView;
            },
            set: function (newValue) {
                this._parentView = newValue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "children", {
            get: function () {
                return this._children;
            },
            set: function (newValue) {
                this._children = newValue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "width", {
            get: function () {
                return this._$el.width();
            },
            set: function (newValue) {
                this._$el.width(newValue);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "height", {
            get: function () {
                return this._$el.height();
            },
            set: function (newValue) {
                this._$el.height(newValue);
            },
            enumerable: true,
            configurable: true
        });

        View.prototype.append = function (childView) {
            // TODO(naphatkrit) check if childView is already a child
            // TODO(naphatkrit) handle if childView already has a parent
            this._$el.append(childView._$el);
            this.children.push(childView);
            childView.parentView = this;
        };
        return View;
    })();
    exports.View = View;

    var FocusableView = (function (_super) {
        __extends(FocusableView, _super);
        function FocusableView() {
            _super.apply(this, arguments);
        }
        FocusableView.prototype.focusView = function () {
            this._$el.focus();
        };
        FocusableView.prototype.blurView = function () {
            this._$el.blur();
        };
        return FocusableView;
    })(View);
    exports.FocusableView = FocusableView;

    var ViewController = (function () {
        function ViewController() {
        }
        return ViewController;
    })();
    exports.ViewController = ViewController;
});

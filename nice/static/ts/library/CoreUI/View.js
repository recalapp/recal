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
    
    return View;
});

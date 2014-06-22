define(["require", "exports", '../Core/InvalidActionException', '../DataStructures/Set'], function(require, exports, InvalidActionException, Set) {
    var View = (function () {
        /******************************************************************
        Methods
        ****************************************************************/
        function View($element) {
            this._$el = null;
            this._parentView = null;
            this._children = new Set();
            if ($element.data(View.JQUERY_DATA_KEY) instanceof View) {
                throw new InvalidActionException('View is already initialized.');
            }
            this._viewNumber = View._viewCount++;
            this._$el = $element;
            this._$el.data(View.JQUERY_DATA_KEY, this);
        }
        Object.defineProperty(View.prototype, "parentView", {
            /******************************************************************
            Properties
            ****************************************************************/
            get: function () {
                return this._parentView;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "children", {
            get: function () {
                return this._children.toArray();
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

        View.fromJQuery = function ($element) {
            if ($element.data(View.JQUERY_DATA_KEY) instanceof View) {
                return $element.data(View.JQUERY_DATA_KEY);
            }
            return new View($element);
        };

        View.prototype.append = function (childView) {
            if (this._children.contains(childView)) {
                throw new InvalidActionException('Cannot add a child view twice.');
            }
            if (childView._parentView != null) {
                throw new InvalidActionException('A view can only have one parent.');
            }
            this._$el.append(childView._$el);
            this._children.add(childView);
            childView.parentView = this;
        };
        View.prototype.removeFromParent = function () {
            if (this._parentView !== null) {
                throw new InvalidActionException('Cannot call removeFromParent() on a view that does not have a parent.');
            }
            this._$el.detach();
            this._parentView._children.remove(this);
            this._parentView = null;
        };
        View.prototype.addEventListener = function (events, listener) {
            this._$el.on(events, listener);
        };
        View.prototype.toString = function () {
            return 'View no. ' + this._viewNumber;
        };
        View.JQUERY_DATA_KEY = 'view_object';
        View._viewCount = 0;
        return View;
    })();
    
    return View;
});

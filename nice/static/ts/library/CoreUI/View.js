define(["require", "exports", 'jquery', "../Core/BrowserEvents", '../Core/InvalidActionException', "../Core/InvalidArgumentException", '../DataStructures/Set'], function(require, exports, $, BrowserEvents, InvalidActionException, InvalidArgumentException, Set) {
    var View = (function () {
        /**
        * Initialize a new View object from the JQuery element.
        * Throws an error if the JQuery element already belongs to another
        * View object.
        */
        function View($element) {
            this._$el = null;
            this._parentView = null;
            this._children = new Set();
            if ($element === null) {
                throw new InvalidArgumentException('A JQuery element must be specified');
            }
            if (View._viewIsInitialized($element)) {
                throw new InvalidActionException('View is already initialized.');
            }
            if ($element.length != 1) {
                throw new InvalidArgumentException('The JQuery element must have exactly one html DOM object.');
            }
            this._viewNumber = View._viewCount++;
            this._$el = $element;
            this._$el.data(View.JQUERY_DATA_KEY, this);
            this._$el.addClass(this.cssClass());
        }
        Object.defineProperty(View.prototype, "parentView", {
            /******************************************************************
            Properties
            ****************************************************************/
            /**
            * The parent view of the view, if exists. Null if no parent
            */
            get: function () {
                return this._parentView;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "children", {
            /**
            * Immutable array of child views
            */
            get: function () {
                return this._children.toArray();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "width", {
            /**
            * Physical width of the view
            */
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
            /**
            * Physical height of the view
            */
            get: function () {
                return this._$el.height();
            },
            set: function (newValue) {
                this._$el.height(newValue);
            },
            enumerable: true,
            configurable: true
        });

        /******************************************************************
        Methods
        ****************************************************************/
        /**
        * The unique css selector for this class.
        */
        View.prototype.cssSelector = function () {
            var classes = this.cssClass().split(/\s+/);
            for (var i = 0; i < classes.length; i++) {
                classes[i] = '.' + classes[i];
            }

            return classes.join('');
        };

        /**
        * The unique css class for this class.
        */
        View.prototype.cssClass = function () {
            return 'view';
        };

        /**
        * Returns true if the view associated with the jQuery element has
        * been initialized.
        */
        View._viewIsInitialized = function ($element) {
            // NOTE(naphatkrit) cannot do a typecheck as of now. instaceof operator does not respect inheritance
            var viewObject = $element.data(View.JQUERY_DATA_KEY);
            return viewObject !== null && viewObject !== undefined;
        };

        /**
        * Initialize a new View object from the JQuery element, or return
        * an existing one.
        * NOTE: initialization must happen top-down. That is, once a view is
        * initialized, all its ancestors (parent, grandparent, etc.) must
        * either already be initialized, or they can be initialized as a
        * generic view class.
        */
        View.fromJQuery = function ($element) {
            if (this._viewIsInitialized($element)) {
                return $element.data(View.JQUERY_DATA_KEY);
            }

            // because the view has not been initalized, it will not belong to
            // the parent's children list yet. We can safely add it
            var view = new this($element);
            if ($element.parent().length > 0) {
                // parent exists
                var parentView = View.fromJQuery($element.parent());
                parentView._children.add(view);
            }
            return view;
        };

        /**
        * Append childView to this view. childView cannot already have a parent
        */
        View.prototype.append = function (childView) {
            var childViewCasted = childView;
            if (this._children.contains(childView)) {
                throw new InvalidActionException('Cannot add a child view twice.');
            }
            if (childViewCasted._parentView !== null) {
                throw new InvalidActionException('A view can only have one parent.');
            }
            this._$el.append(childViewCasted._$el);
            this._children.add(childView);
            childViewCasted._parentView = this;
            this.triggerEvent(BrowserEvents.viewWasAppended, {
                childView: childView,
                parentView: this
            });
        };

        /**
        * Append this view to the parent view of the parameter siblingView,
        * in the position right after siblingView.
        */
        View.prototype.insertAfter = function (siblingView) {
            var parentView = siblingView.parentView;
            var siblingViewCasted = siblingView;
            if (parentView === null || parentView === undefined) {
                throw new InvalidActionException('Cannot append after a view that does not have a parent');
            }
            if (parentView._children.contains(this)) {
                throw new InvalidActionException('Cannot add a child view twice.');
            }
            if (this.parentView !== null) {
                throw new InvalidActionException('A view can only have one parent.');
            }
            siblingViewCasted._$el.after(this._$el);
            parentView._children.add(this);
            this._parentView = parentView;
            parentView.triggerEvent(BrowserEvents.viewWasAppended, {
                childView: this,
                parentView: parentView
            });
        };

        /**
        * Remove this view from its parent. Cannot be called if this view
        * does not have a parent.
        */
        View.prototype.removeFromParent = function () {
            var parentView = this._parentView;
            if (parentView === null) {
                throw new InvalidActionException('Cannot call removeFromParent() on a view that does not have a parent.');
            }
            this._$el.detach();
            parentView._children.remove(this);
            this._parentView = null;
            parentView.triggerEvent(BrowserEvents.viewWasRemoved, {
                childView: this,
                parentView: parentView
            });
        };

        View.prototype.attachEventHandler = function (ev, argumentThree, handler) {
            var eventName = ev;
            var $element = this._$el;
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

        View.prototype.attachOneTimeEventHandler = function (ev, argumentThree, handler) {
            var eventName = ev;
            var $element = this._$el;
            if (typeof argumentThree === 'string' || argumentThree instanceof String || argumentThree.constructor === String) {
                if (handler === undefined) {
                    throw new InvalidArgumentException("No handler provided.");
                }
                $element.one(eventName, argumentThree, handler);
            } else if (typeof argumentThree === 'function') {
                $element.one(eventName, argumentThree);
            } else {
                throw new InvalidArgumentException("The second argument must either be a string or a function.");
            }
        };

        View.prototype.triggerEvent = function (ev, extraParameter) {
            var eventName = ev;
            if (extraParameter === undefined || extraParameter === null) {
                extraParameter = {};
            }
            extraParameter.view = this;
            this._$el.trigger(eventName, extraParameter);
        };

        /**
        * Returns true if $element is the view itself
        * or is a descendent of the view.
        */
        View.prototype.containsJQueryElement = function ($element) {
            return this._$el.is($element) || this._$el.find($element).length != 0;
        };

        /**
        * Remove all children from this view, both initialized and uninitialized
        */
        View.prototype.removeAllChildren = function () {
            $.each(this.children, function (index, child) {
                child.removeFromParent();
            });
            this._$el.html('');
            this._children = new Set();
        };

        /**
        * Unique
        */
        View.prototype.toString = function () {
            return 'View no. ' + this._viewNumber;
        };
        View.JQUERY_DATA_KEY = 'view_object';
        View._viewCount = 0;
        return View;
    })();
    
    return View;
});

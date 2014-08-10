/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SidebarFullViewContainer', './SidebarStackViewContainer', '../CoreUI/View'], function(require, exports, SidebarFullViewContainer, SidebarStackViewContainer, View) {
    var SidebarView = (function (_super) {
        __extends(SidebarView, _super);
        function SidebarView($element) {
            _super.call(this, $element);
            this._fullViewContainer = null;
            this._stackViewContainer = null;
            var $stack = this._$el.find('#sb-left-container');
            this.stackViewContainer = SidebarStackViewContainer.fromJQuery($stack);
            var $full = this._$el.find('#sb-full-container');
            this.fullViewContainer = SidebarFullViewContainer.fromJQuery($full);
        }
        Object.defineProperty(SidebarView.prototype, "fullViewContainer", {
            get: function () {
                return this._fullViewContainer;
            },
            set: function (value) {
                this._fullViewContainer = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(SidebarView.prototype, "stackViewContainer", {
            get: function () {
                return this._stackViewContainer;
            },
            set: function (value) {
                this._stackViewContainer = value;
            },
            enumerable: true,
            configurable: true
        });


        /********************************************************************
        Stack View
        ******************************************************************/
        /**
        * pushes the view into the view stack if the identitifer does not
        * already exists. Otherwise, replace the old view.
        */
        SidebarView.prototype.pushStackViewWithIdentifier = function (stackView, identifier) {
            this.stackViewContainer.addOrReplaceViewWithIdentifier(stackView, identifier);
        };

        /**
        * Returns true of a view with the identifier already exists.
        */
        SidebarView.prototype.containsStackViewWithIdentifier = function (identifier) {
            return this.stackViewContainer.containsViewWithIdentifier(identifier);
        };

        /**
        * Returns the view with identifier. null if does not exist.
        */
        SidebarView.prototype.getStackViewWithIdentifier = function (identifier) {
            return this.getStackViewWithIdentifier(identifier);
        };

        /**
        * Remove the view with identifier and return it. Throws an exception
        * if does not exist
        */
        SidebarView.prototype.popStackViewWithIdentifier = function (identifier) {
            var view = this.getStackViewWithIdentifier(identifier);
            this.stackViewContainer.removeViewWithIdentifier(identifier);
            return view;
        };

        /********************************************************************
        Full View
        ******************************************************************/
        /**
        * Sets a view to be the full view, replacing the old one
        * if necessary.
        */
        SidebarView.prototype.setFullView = function (fullView) {
            this.fullViewContainer.setView(fullView);
        };

        /**
        * Returns true if a full view has been set.
        */
        SidebarView.prototype.containsFullView = function () {
            return this.fullViewContainer.hasView();
        };

        /**
        * Retrieves the full view. null if does not exist.
        */
        SidebarView.prototype.getFullView = function () {
            return this.fullViewContainer.getView();
        };

        /**
        * Unset the full view and return it. null if does not exist. Throws
        * an exception if none has been set
        */
        SidebarView.prototype.unsetFullView = function () {
            this.fullViewContainer.unsetView();
        };

        /********************************************************************
        Droppable Behavior
        ******************************************************************/
        /**
        * Registers view with the css selector to receive droppable events
        */
        SidebarView.prototype.registerDroppable = function (cssSelector) {
        };
        return SidebarView;
    })(View);

    
    return SidebarView;
});

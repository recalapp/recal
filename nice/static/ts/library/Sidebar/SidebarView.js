/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../DataStructures/Set', './SidebarFullViewContainer', './SidebarStackViewContainer', '../CoreUI/View', "jqueryui"], function(require, exports, $, BrowserEvents, Set, SidebarFullViewContainer, SidebarStackViewContainer, View) {
    var SidebarView = (function (_super) {
        __extends(SidebarView, _super);
        function SidebarView($element, cssClass) {
            var _this = this;
            _super.call(this, $element, cssClass);
            this._fullViewContainer = null;
            this._stackViewContainer = null;
            this._droppableCssSelectors = new Set();
            this._$sidebar = null;
            this._$sidebar = this._$el.find('#sidebar');
            var $stack = this._$el.find('#sb-left-container');
            this.stackViewContainer = SidebarStackViewContainer.fromJQuery($stack);
            var $full = this._$el.find('#sb-full-container');
            this.fullViewContainer = SidebarFullViewContainer.fromJQuery($full);

            // droppable
            this._$sidebar.droppable({
                drop: function (ev, ui) {
                    var $ui = $(ui);
                    if ($ui.is(_this.droppableCssSelectorsString)) {
                        View.fromJQuery($ui).triggerEvent(BrowserEvents.sidebarViewDidDrop);
                    }
                },
                hoverClass: 'hover-active'
            });
            this._$el.find('#sidebar-target').droppable({
                over: function (ev, ui) {
                    if ($(ui).is(_this.droppableCssSelectorsString)) {
                        _this.showSidebar();
                    }
                },
                out: function (ev, ui) {
                    _this.hideSidebarIfEmpty();
                }
            });
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


        Object.defineProperty(SidebarView.prototype, "droppableCssSelectorsString", {
            get: function () {
                if (this._droppableCssSelectorsString === null || this._droppableCssSelectorsString === undefined) {
                    this._droppableCssSelectorsString = this._droppableCssSelectors.toArray().join();
                }
                return this._droppableCssSelectorsString;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SidebarView, "cssClass", {
            get: function () {
                return View.cssClass + ' sidebarView';
            },
            enumerable: true,
            configurable: true
        });

        SidebarView.prototype.showSidebar = function () {
            this._$sidebar.addClass('in');
            this._$el.find('#sb-handle').find('.glyphicon').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
        };

        SidebarView.prototype.showSidebarFull = function () {
            this.showSidebar();
            this._$sidebar.addClass('full');
        };
        SidebarView.prototype.hideSidebarFull = function () {
            this._$sidebar.removeClass('full');
            this.hideSidebarIfEmpty();
        };

        SidebarView.prototype.hideSidebar = function () {
            this.triggerEvent(BrowserEvents.sidebarWillHide);
            this._$sidebar.removeClass('in');
            this._$el.find('#sb-handle').find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
        };

        SidebarView.prototype.hideSidebarIfEmpty = function () {
            if (this.isEmpty) {
                this.hideSidebar();
            }
        };

        Object.defineProperty(SidebarView.prototype, "isEmpty", {
            get: function () {
                return !this.fullViewContainer.hasView() && this.stackViewContainer.isEmpty;
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
            this.showSidebar();
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
            return this.stackViewContainer.getViewWithIdentifier(identifier);
        };

        /**
        * Remove the view with identifier and return it. Throws an exception
        * if does not exist. Notes that animation causes a delay, as the
        * view is only removed after animation.
        */
        SidebarView.prototype.popStackViewWithIdentifier = function (identifier, animated) {
            var view = this.getStackViewWithIdentifier(identifier);
            this.stackViewContainer.removeViewWithIdentifier(identifier, animated);
            this.hideSidebarIfEmpty();
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
            this.showSidebarFull();
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
            this.hideSidebarFull();
            this.hideSidebarIfEmpty();
        };

        /********************************************************************
        Droppable Behavior
        ******************************************************************/
        /**
        * Registers view with the css selector to receive droppable events
        */
        SidebarView.prototype.registerDroppable = function (cssSelector) {
            this._droppableCssSelectors.add(cssSelector);
            this._droppableCssSelectorsString = null;
        };
        return SidebarView;
    })(View);

    
    return SidebarView;
});

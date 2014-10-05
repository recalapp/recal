/// <reference path="../../typings/tsd.d.ts" />
/// <amd-dependency path="bootstrap" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../Core/GlobalCssClass', '../Core/InvalidActionException', './View', "bootstrap"], function(require, exports, $, BrowserEvents, GlobalCssClass, InvalidActionException, View) {
    var FocusableView = (function (_super) {
        __extends(FocusableView, _super);
        function FocusableView($element, cssClass) {
            var _this = this;
            _super.call(this, $element, cssClass);
            this._hasFocus = false;
            this._popoverView = null;
            this._$el.attr('tabindex', 0);
            this._$el.removeClass(GlobalCssClass.invisibleFocus);
            this._$el.find('*').each(function (index, child) {
                var $child = $(child);
                if ($child.attr('tabindex') === undefined || $child.attr('tabindex') === null) {
                    $child.attr('tabindex', -1); // this allows the child to be focused but not be in the tab order
                    $child.addClass(GlobalCssClass.invisibleFocus);
                    // TODO add to css: { outline-color: transparent; outline-style: none; }
                }
            });
            this.attachEventHandler(BrowserEvents.focusIn, function (ev) {
                if (_this.containsJQueryElement($(document.activeElement))) {
                    _this.didFocus();
                }
            });
            this.attachEventHandler(BrowserEvents.focusOut, function (ev) {
                if (!_this.containsJQueryElement($(document.activeElement))) {
                    _this.didBlur();
                }
            });
            this.attachEventHandler(BrowserEvents.keyPress, function (ev) {
                var keyCode = ev.keyCode || ev.which;
                if (keyCode == 13) {
                    if (_this.hasFocus) {
                        _this.triggerEvent(BrowserEvents.click, {
                            keyCode: keyCode
                        });
                    }
                }
            });
        }
        Object.defineProperty(FocusableView.prototype, "popoverView", {
            get: function () {
                return this._popoverView;
            },
            set: function (value) {
                this._popoverView = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(FocusableView, "cssClass", {
            /**
            * The unique css class for this class.
            */
            get: function () {
                return View.cssClass + ' focusableView';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(FocusableView.prototype, "hasFocus", {
            get: function () {
                return this._hasFocus;
            },
            enumerable: true,
            configurable: true
        });

        FocusableView.prototype.didFocus = function () {
            this._hasFocus = true;
            this.triggerEvent(BrowserEvents.focusableViewDidFocus);
        };
        FocusableView.prototype.didBlur = function () {
            var _this = this;
            this._hasFocus = false;
            this.triggerEvent(BrowserEvents.focusableViewDidBlur);

            // popover
            if (this.popoverView !== null && this.popoverView !== undefined) {
                // TODO right now need setTimeout because
                // browser first calls blur, then focus.
                // so by this time, the popoverView may not
                // have received focus yet. Figure out a better
                // way to do this.
                setTimeout(function () {
                    if (!_this.popoverView) {
                        return;
                    }
                    if (!_this.popoverView.hasFocus) {
                        // focus lost
                        _this.hidePopover();
                    } else {
                        // focus lost, but the popover view itself now has focus. we will only call hide when this popover view loses focus
                        _this.popoverView.attachEventHandler(BrowserEvents.focusableViewDidBlur, function (ev) {
                            // timeout handles the case where
                            // the same element is clicked twice.
                            setTimeout(function () {
                                if (_this.popoverView && !_this.popoverView.hasFocus) {
                                    _this.hidePopover();
                                }
                            }, 300);
                        });
                    }
                }, 300);
            }
        };

        /**
        * Shows a view as popover originating from this view
        */
        FocusableView.prototype.showViewInPopover = function (childView, placement) {
            if (typeof placement === "undefined") { placement = 'auto'; }
            var childViewCasted = childView;
            this.popoverView = childViewCasted;
            if (this.popoverView !== null && this.popoverView !== undefined) {
                this._$el.popover('destroy');
            }
            this._$el.popover({
                template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
                placement: placement,
                html: true,
                content: childViewCasted._$el[0],
                trigger: 'manual'
            });
            this._$el.popover('show');
            if (!this.hasFocus) {
                this._$el.focus();
            }
        };

        /**
        * Remove the popover element
        */
        FocusableView.prototype.hidePopover = function () {
            var _this = this;
            if (this.popoverView === null || this.popoverView === undefined) {
                throw new InvalidActionException('Cannot call hidePopover when there is no popover shown');
            }
            this._$el.popover('hide');
            this.popoverView = null;
            this.attachOneTimeEventHandler(BrowserEvents.bootstrapPopoverHidden, function (ev) {
                _this._$el.popover('destroy');
            });
        };

        /**
        * Brings the view into focus
        */
        FocusableView.prototype.focus = function () {
            this._$el.focus();
        };

        /**
        * Brings the view into blur
        */
        FocusableView.prototype.blur = function () {
            this._$el.blur();
        };
        return FocusableView;
    })(View);
    
    return FocusableView;
});
//# sourceMappingURL=FocusableView.js.map

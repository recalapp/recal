/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../Core/InvalidActionException', '../CoreUI/View'], function(require, exports, $, BrowserEvents, InvalidActionException, View) {
    var SidebarFullViewContainer = (function (_super) {
        __extends(SidebarFullViewContainer, _super);
        function SidebarFullViewContainer($element, cssClass) {
            _super.call(this, $element, cssClass);
            this.removeAllChildren();
        }
        Object.defineProperty(SidebarFullViewContainer.prototype, "childrenWithIn", {
            get: function () {
                return $.grep(this.children, function (view, index) {
                    return view._$el.hasClass('in');
                });
            },
            enumerable: true,
            configurable: true
        });

        SidebarFullViewContainer.prototype.setView = function (view) {
            if (this.hasView()) {
                this.unsetView();
            }
            this.append(view);
            view._$el.addClass('in');
        };

        SidebarFullViewContainer.prototype.hasView = function () {
            return this.childrenWithIn.length > 0;
        };

        SidebarFullViewContainer.prototype.getView = function () {
            if (!this.hasView()) {
                return null;
            }
            return this.childrenWithIn[0];
        };

        SidebarFullViewContainer.prototype.unsetView = function () {
            if (!this.hasView()) {
                throw new InvalidActionException('Cannot unset a full view that has never been set');
            }
            var view = this.getView();
            view.attachOneTimeEventHandler(BrowserEvents.transitionEnd, function (ev) {
                view.removeFromParent();
            });
            view._$el.removeClass('in');
        };
        return SidebarFullViewContainer;
    })(View);

    
    return SidebarFullViewContainer;
});

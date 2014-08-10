/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/BrowserEvents', '../DataStructures/Dictionary', '../Core/InvalidActionException', '../CoreUI/View'], function(require, exports, BrowserEvents, Dictionary, InvalidActionException, View) {
    var SidebarStackViewContainer = (function (_super) {
        __extends(SidebarStackViewContainer, _super);
        function SidebarStackViewContainer($element) {
            _super.call(this, $element);
            this._viewDict = new Dictionary();
            this.removeAllChildren();
        }
        SidebarStackViewContainer.prototype.addOrReplaceViewWithIdentifier = function (view, identifier) {
            if (this._viewDict.contains(identifier)) {
                var oldView = this._viewDict.get(identifier);
                view.insertAfter(oldView);
                oldView.removeFromParent();
            } else {
                this.append(view);
                this._viewDict.set(identifier, view);
            }
            view._$el.addClass('in');
        };

        SidebarStackViewContainer.prototype.containsViewWithIdentifier = function (identifier) {
            return this._viewDict.contains(identifier);
        };

        SidebarStackViewContainer.prototype.getViewWithIdentifier = function (identifier) {
            if (!this.containsViewWithIdentifier) {
                return null;
            }
            return this._viewDict.get(identifier);
        };

        SidebarStackViewContainer.prototype.removeViewWithIdentifier = function (identifier) {
            var _this = this;
            // handle class "in" logic to give transition
            if (!this._viewDict.contains(identifier)) {
                throw new InvalidActionException('Sidebar Stack View does not contain a view with identifier "' + identifier + '"');
            }
            var view = this._viewDict.get(identifier);
            view.attachOneTimeEventHandler(BrowserEvents.transitionEnd, function (ev) {
                // when transition ends, check if the view still does not
                // have the class in, just to verify that it wasn't readded.
                if (view._$el.hasClass('in')) {
                    return;
                }
                view.removeFromParent();

                // only unset after the view is physically removed
                // (not just that it does not have the in class), otherwise if
                // the same view is added again, an exception will be thrown
                _this._viewDict.unset(identifier);
            });
            view._$el.removeClass('in');
        };
        return SidebarStackViewContainer;
    })(View);

    
    return SidebarStackViewContainer;
});

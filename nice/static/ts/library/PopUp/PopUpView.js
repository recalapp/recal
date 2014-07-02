var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../CoreUI/FocusableView', './PopUpCommon'], function(require, exports, $, BrowserEvents, FocusableView, PopUpCommon) {
    // aliases
    var PopUpType = PopUpCommon.PopUpType;

    var PopUpView = (function (_super) {
        __extends(PopUpView, _super);
        function PopUpView(view) {
            var _this = this;
            _super.call(this, view);

            // TODO handle main/not main difference
            // TODO make draggable
            this._$el.draggable({
                handle: '.panel > .panel-heading',
                containment: '#content_bounds',
                scroll: false,
                appendTo: 'body',
                zIndex: 2000,
                beforeSend: function (ev, ui) {
                    if (_this.isMain) {
                        // TODO handle main/pinned
                        // TODO WONTFIX see if bounding rect logic is needed - do that in a subclass
                        _this.triggerEvent(4 /* popUpWillDetach */);
                        // needed because when first move, we move to a different
                        // parent. maybe should expose as an event
                    }
                }
            });
            this.attachEventHandler(4 /* popUpWillDetach */, function (ev, eventData) {
                var popUpView = eventData.view;
                popUpView._makeResizable();
            });

            // TODO handle mousedown (should be in view controller?)
            // TODO support for shift-click
            // TODO WONTFIX max height - in subclass
            // TODO initialize as needed
            // TODO tool tip - separate module
            this._$el.find('.withtooltip').tooltip({});
            // TODO theme - separate module
            // NOTE extra initialization can be done by overriding the constructor
        }
        Object.defineProperty(PopUpView.prototype, "popUpId", {
            get: function () {
                return this._popUpId;
            },
            set: function (newValue) {
                this._popUpId = newValue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PopUpView.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (newValue) {
                this._color = newValue;
                this._updateColor();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PopUpView.prototype, "isMain", {
            get: function () {
                return this._type === 0 /* main */;
            },
            enumerable: true,
            configurable: true
        });

        PopUpView.prototype._makeResizable = function () {
            var _this = this;
            this._$el.find(PopUpCommon.PanelCssSelector).resizable({
                stop: function (ev, ui) {
                    _this._$el.css("height", $(ui).css('height'));
                    _this._$el.css('width', $(ui).css('width'));
                    // TODO setbodywidth
                }
            });
        };

        PopUpView.prototype.removeFromParent = function () {
            _super.prototype.removeFromParent.call(this);
            // TODO WONTFIX handle PopUp_close() logic - subclass
        };

        PopUpView.prototype.focusView = function () {
            this._$el.css('z-index', '200');

            var $panel = this._$el.find(PopUpCommon.PanelCssSelector);
            $panel.addClass(PopUpCommon.FocusClass).removeClass(PopUpCommon.BlurClass);
            // TODO color and opacity
        };

        PopUpView.prototype.blurView = function () {
            // TODO PopUp_loseFocus()
            this._$el.css('z-index', '100');
            var $panel = this._$el.find(PopUpCommon.PanelCssSelector);
            $panel.addClass(PopUpCommon.BlurClass).removeClass(PopUpCommon.FocusClass);
        };

        PopUpView.prototype._updateColor = function () {
            // TODO make color a class
            // TODO PopUp_setColor
        };
        return PopUpView;
    })(FocusableView);

    
    return PopUpView;
});

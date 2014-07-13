var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../CoreUI/FocusableView', './PopUpCommon', "bootstrap", "jqueryui"], function(require, exports, $, BrowserEvents, FocusableView, PopUpCommon) {
    // aliases
    var PopUpType = PopUpCommon.PopUpType;

    var oldMouseStart = $.ui.draggable.prototype._mouseStart;
    $.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event, this._uiHash());
        oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
    };

    var PopUpView = (function (_super) {
        __extends(PopUpView, _super);
        function PopUpView(view) {
            _super.call(this, view);
            this._type = 0 /* main */;

            // TODO handle main/not main difference
            this._makeDraggable();
            this.attachEventHandler(BrowserEvents.popUpWillDetach, function (ev, eventData) {
                var popUpView = eventData.view;
                popUpView._makeResizable();
            });

            // TODO support for shift-click
            // TODO WONTFIX max height - in subclass
            // TODO initialize as needed
            // TODO tool tip - separate module - maybe in View base
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

        PopUpView.prototype._makeDraggable = function () {
            var _this = this;
            this._$el.draggable({
                handle: '.panel > .panel-heading',
                containment: '#content_bounds',
                scroll: false,
                appendTo: 'body',
                zIndex: 2000,
                beforeStart: function (ev, ui) {
                    if (_this.isMain) {
                        _this._type = 1 /* detached */;

                        // TODO handle main/pinned
                        // TODO WONTFIX see if bounding rect logic is needed - do that in a subclass
                        _this.triggerEvent(BrowserEvents.popUpWillDetach);
                        // needed because when first move, we move to a different
                        // parent. maybe should expose as an event
                    }
                }
            });
        };
        PopUpView.prototype._makeResizable = function () {
            var _this = this;
            this._$el.find(PopUpCommon.PanelCssSelector).resizable({
                stop: function (ev, ui) {
                    _this._$el.css("height", ui.size.height);
                    _this._$el.css('width', ui.size.width);
                    // TODO setbodywidth
                }
            });
        };

        PopUpView.prototype.removeFromParent = function () {
            _super.prototype.removeFromParent.call(this);
            // TODO WONTFIX handle PopUp_close() logic - subclass
        };

        PopUpView.prototype.focusView = function () {
            _super.prototype.focusView.call(this);
            this.triggerEvent(BrowserEvents.popUpRequestFocus);
        };

        PopUpView.prototype.blurView = function () {
            _super.prototype.blurView.call(this);
            this.unhighlight();
        };

        PopUpView.prototype.highlight = function () {
            this._$el.css('z-index', '200');

            var $panel = this._$el.find(PopUpCommon.PanelCssSelector);
            $panel.addClass(PopUpCommon.FocusClass).removeClass(PopUpCommon.BlurClass);
            // TODO color and opacity
        };

        PopUpView.prototype.unhighlight = function () {
            // TODO PopUp_loseFocus()
            this._$el.css('z-index', '100');
            var $panel = this._$el.find(PopUpCommon.PanelCssSelector);
            $panel.addClass(PopUpCommon.BlurClass).removeClass(PopUpCommon.FocusClass);
        };

        PopUpView.prototype._updateColor = function () {
            // TODO make color a class
            var $heading = this._$el.find(PopUpCommon.HeadingCssSelector);
            var opacity = this.hasFocus ? PopUpCommon.FocusOpacity : PopUpCommon.BlurOpacity;
            $heading.css({
                'background-color': this.color,
                'border-color': this.color,
                opacity: opacity
            });
        };
        return PopUpView;
    })(FocusableView);

    
    return PopUpView;
});

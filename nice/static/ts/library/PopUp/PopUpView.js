var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../ClickToEdit/ClickToEditBaseView', '../CoreUI/FocusableView', './PopUpCommon', './PopUpType', "bootstrap", "jqueryui"], function(require, exports, $, BrowserEvents, ClickToEditBaseView, FocusableView, PopUpCommon, PopUpType) {
    var oldMouseStart = $.ui.draggable.prototype._mouseStart;
    $.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event, this._uiHash());
        oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
    };

    var PopUpView = (function (_super) {
        __extends(PopUpView, _super);
        function PopUpView($element, cssClass) {
            _super.call(this, $element, cssClass);
            this._type = 1 /* pinned */;

            // TODO handle main/not main difference
            this.makeDraggable();
            this.attachEventHandler(BrowserEvents.popUpWillDetach, function (ev, eventData) {
                var popUpView = eventData.view;
                popUpView.makeResizable();
            });
            this.attachEventHandler(BrowserEvents.mouseDown, function (ev) {
                // don't prevent default, the default behavior causes other elements
                // to lose focus
                var $targetView = $(ev.target);
                if (!$targetView.is(ClickToEditBaseView.cssSelector())) {
                    $targetView.focus();
                }
            });
            // TODO support for shift-click
            // TODO WONTFIX max height - in subclass
            // TODO initialize as needed
            // TODO tool tip - separate module - maybe in View base
            // this._$el.find('.withtooltip').tooltip({});
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

        Object.defineProperty(PopUpView.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PopUpView, "cssClass", {
            /**
            * The unique css class for this class.
            */
            get: function () {
                return FocusableView.cssClass + ' ' + PopUpCommon.cssClass;
            },
            enumerable: true,
            configurable: true
        });

        PopUpView.prototype.makeDraggable = function () {
            var _this = this;
            this._$el.draggable({
                handle: '.panel > .panel-heading',
                containment: '#content_bounds',
                scroll: false,
                appendTo: 'body',
                zIndex: 2000,
                beforeStart: function (ev, ui) {
                    if (_this.type !== 0 /* detached */) {
                        _this.type = 0 /* detached */;

                        // TODO handle main/pinned
                        // TODO WONTFIX see if bounding rect logic is needed - do that in a subclass
                        _this.triggerEvent(BrowserEvents.popUpWillDetach);
                        // needed because when first move, we move to a different
                        // parent. maybe should expose as an event
                    }
                }
            });
        };
        PopUpView.prototype.makeResizable = function () {
            var _this = this;
            this._$el.find(PopUpCommon.panelCssSelector).resizable({
                stop: function (ev, ui) {
                    _this._$el.css("height", ui.size.height);
                    _this._$el.css('width', ui.size.width);
                    // TODO setbodywidth
                }
            });
        };

        PopUpView.prototype.didFocus = function () {
            _super.prototype.didFocus.call(this);
            this.highlight();
        };

        PopUpView.prototype.didBlur = function () {
            _super.prototype.didBlur.call(this);
            this.unhighlight();
        };

        PopUpView.prototype.highlight = function () {
            this._$el.css('z-index', '200');

            var $panel = this._$el.find(PopUpCommon.panelCssSelector);
            $panel.addClass(PopUpCommon.focusClass).removeClass(PopUpCommon.blurClass);
            // TODO color and opacity
        };

        PopUpView.prototype.unhighlight = function () {
            // TODO PopUp_loseFocus()
            this._$el.css('z-index', '100');
            var $panel = this._$el.find(PopUpCommon.panelCssSelector);
            $panel.addClass(PopUpCommon.blurClass).removeClass(PopUpCommon.focusClass);
        };

        PopUpView.prototype._updateColor = function () {
            // TODO make color a class
            var $heading = this._$el.find(PopUpCommon.headingCssSelector);
            var opacity = this.hasFocus ? PopUpCommon.focusOpacity : PopUpCommon.blurOpacity;
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

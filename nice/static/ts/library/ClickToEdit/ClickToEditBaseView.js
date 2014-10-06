/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', "../Core/BrowserEvents", '../CoreUI/FocusableView', "../Core/EncodeDecodeProxy", '../Core/InvalidArgumentException'], function(require, exports, $, BrowserEvents, FocusableView, EncodeDecodeProxy, InvalidArgumentException) {
    var ClickToEditBaseView = (function (_super) {
        __extends(ClickToEditBaseView, _super);
        function ClickToEditBaseView($element, cssClass) {
            _super.call(this, $element, cssClass);
            if (!this._$el.is('p, h1, h2, h3, h4, h5, h6, span')) {
                throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, h6, or span');
            }
            this._initializeClickToEdit();
        }
        Object.defineProperty(ClickToEditBaseView.prototype, "encodeDecodeProxy", {
            get: function () {
                if (!ClickToEditBaseView._encodeDecodeProxy) {
                    ClickToEditBaseView._encodeDecodeProxy = new EncodeDecodeProxy();
                }
                return ClickToEditBaseView._encodeDecodeProxy;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClickToEditBaseView, "cssClass", {
            /**
            * The unique css class for this class.
            */
            get: function () {
                return FocusableView.cssClass + ' clickToEdit';
            },
            enumerable: true,
            configurable: true
        });

        ClickToEditBaseView.prototype._initializeClickToEdit = function () {
            var _this = this;
            var options = this.options();
            options.type = this.inputType;
            options.event = BrowserEvents.clickToEditShouldBegin;
            options.onblur = 'submit';
            options.callback = function (value, settings) {
                _this.triggerEvent(BrowserEvents.clickToEditComplete, {
                    value: value
                });
            };
            this._$el.editable(function (value, settings) {
                var processed = _this.processFormValue(value, settings);
                return processed;
            }, options);
            this.attachEventHandler(BrowserEvents.click, function () {
                _this.triggerEvent(BrowserEvents.clickToEditShouldBegin);
            });
        };

        Object.defineProperty(ClickToEditBaseView.prototype, "value", {
            get: function () {
                return this._$el.text();
            },
            set: function (text) {
                this._$el.text(text);
            },
            enumerable: true,
            configurable: true
        });


        ClickToEditBaseView.prototype.didFocus = function () {
            _super.prototype.didFocus.call(this);
            this.triggerEvent(BrowserEvents.clickToEditShouldBegin);

            // don't allow itself to be tabbed when focused, since the form
            // will receive the tab
            this._$el.attr('tabindex', -1);
        };

        ClickToEditBaseView.prototype.didBlur = function () {
            _super.prototype.didBlur.call(this);
            this._$el.attr('tabindex', 0);
        };

        ClickToEditBaseView.prototype.options = function () {
            return {};
        };

        Object.defineProperty(ClickToEditBaseView.prototype, "inputType", {
            /**
            * The unique input type identifier associated with this type of input
            */
            get: function () {
                return 'text';
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Returns the string html value of the form value. Do processing
        * such as converting \n to <br>
        */
        ClickToEditBaseView.prototype.processFormValue = function (value, settings) {
            return this.encodeDecodeProxy.htmlEncode(value);
        };

        /**
        * Create a new input element and attach it to the form. Return part of the
        * created element meant to hold the value of the input
        */
        ClickToEditBaseView.prototype.element = function ($form, settings) {
            var $input = $('<input>');
            $form.append($input);
            return $input;
        };

        /**
        * Set the value of the input to match the value of the contentString.
        */
        ClickToEditBaseView.prototype.content = function ($form, contentString, settings) {
            var decoded = this.encodeDecodeProxy.htmlDecode(contentString);
            $form.find('input').val(decoded);
        };

        /**
        * Call before the value of the form is saved. Not usually needed.
        * Use processFormValue() instead to parse the value of the form
        * back to the appropriate display element.
        */
        ClickToEditBaseView.prototype.submit = function ($form, settings) {
        };

        /**
        * Initialize any plugins here
        */
        ClickToEditBaseView.prototype.plugin = function ($form, settings) {
        };
        ClickToEditBaseView._encodeDecodeProxy = null;
        return ClickToEditBaseView;
    })(FocusableView);
    
    return ClickToEditBaseView;
});
//# sourceMappingURL=ClickToEditBaseView.js.map

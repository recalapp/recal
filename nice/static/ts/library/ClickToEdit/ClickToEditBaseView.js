/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', "../Core/BrowserEvents", '../CoreUI/FocusableView', "../Core/EncodeDecodeProxy", '../Core/InvalidArgumentException', '../DataStructures/Set'], function(require, exports, $, BrowserEvents, FocusableView, EncodeDecodeProxy, InvalidArgumentException, Set) {
    var ClickToEditBaseView = (function (_super) {
        __extends(ClickToEditBaseView, _super);
        function ClickToEditBaseView($element, cssClass) {
            _super.call(this, $element, cssClass);
            if (!this._$el.is('p, h1, h2, h3, h4, h5, h6')) {
                throw new InvalidArgumentException('ClickToEdit must be p, h1, h2, h3, h4, h5, or h6');
            }
            this._initializeClickToEdit();
        }
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
            if (!ClickToEditBaseView._customTypes.contains(this.inputType())) {
                // initialize the custom type
                ClickToEditBaseView._customTypes.add(this.inputType());

                // NOTE this = form in the context of functions
                $.editable.addInputType(this.inputType(), {
                    element: function (settings, original) {
                        // ok to do this because we assume the view is
                        // already initialized, so the created instance
                        // will be of the correct ClickToEdit type.
                        var view = ClickToEditBaseView.fromJQuery($(original));
                        return view.element($(this), settings);
                    },
                    content: function (contentString, settings, original) {
                        var view = ClickToEditBaseView.fromJQuery($(original));
                        return view.content($(this), contentString, settings);
                    },
                    plugin: function (settings, original) {
                        var view = ClickToEditBaseView.fromJQuery($(original));
                        return view.plugin($(this), settings);
                    }
                });
            }
            var options = this.options();
            options.type = this.inputType();
            options.event = BrowserEvents.clickToEditShouldBegin;
            options.onblur = 'submit';
            this._$el.editable(function (value, settings) {
                var processed = _this.processFormValue(value, settings);
                _this.triggerEvent(BrowserEvents.clickToEditComplete, {
                    value: processed
                });
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

        /**
        * The unique input type identifier associated with this type of input
        */
        ClickToEditBaseView.prototype.inputType = function () {
            return 'text';
        };

        /**
        * Returns the string html value of the form value. Do processing
        * such as converting \n to <br>
        */
        ClickToEditBaseView.prototype.processFormValue = function (value, settings) {
            return EncodeDecodeProxy.instance.htmlEncode(value);
        };

        /**
        * Create a new input element and attach it to the form. Also return
        * the created element.
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
            var decoded = EncodeDecodeProxy.instance.htmlDecode(contentString);
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
        ClickToEditBaseView._customTypes = new Set();
        return ClickToEditBaseView;
    })(FocusableView);
    
    return ClickToEditBaseView;
});

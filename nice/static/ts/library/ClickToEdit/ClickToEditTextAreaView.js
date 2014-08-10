/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './ClickToEditBaseView', "../Core/EncodeDecodeProxy"], function(require, exports, $, ClickToEditBaseView, EncodeDecodeProxy) {
    var ClickToEditTextAreaView = (function (_super) {
        __extends(ClickToEditTextAreaView, _super);
        function ClickToEditTextAreaView() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(ClickToEditTextAreaView, "cssClass", {
            /**
            * The unique css class for this class.
            */
            get: function () {
                return ClickToEditBaseView.cssClass + ' clickToEditTextAreaView';
            },
            enumerable: true,
            configurable: true
        });

        /**
        * The unique input type identifier associated with this type of input
        */
        ClickToEditTextAreaView.prototype.inputType = function () {
            return 'CTE_TextArea';
        };

        /**
        * Returns the string html value of the form value. Do processing
        * such as converting \n to <br>
        */
        ClickToEditTextAreaView.prototype.processFormValue = function (value, settings) {
            var encoded = EncodeDecodeProxy.instance().htmlEncode(value);
            encoded = EncodeDecodeProxy.instance().newLinesToBr(encoded);
            return encoded;
        };

        /**
        * Create a new input element and attach it to the form. Also return
        * the created element.
        */
        ClickToEditTextAreaView.prototype.element = function ($form, settings) {
            var $input = $('<textarea>').addClass('form-control');
            $input.height(settings.height);
            $form.append($input);
            return $input;
        };

        /**
        * Set the value of the input to match the value of the contentString.
        */
        ClickToEditTextAreaView.prototype.content = function ($form, contentString, settings) {
            var decoded = EncodeDecodeProxy.instance().brToNewLines(contentString);
            decoded = EncodeDecodeProxy.instance().htmlDecode(decoded);
            $form.find('textarea').val(decoded);
        };
        return ClickToEditTextAreaView;
    })(ClickToEditBaseView);
    
    return ClickToEditTextAreaView;
});

/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './ClickToEditBaseView', './ClickToEditType', '../CustomInputs/TimeInputView'], function(require, exports, $, ClickToEditBaseView, ClickToEditType, TimeInputView) {
    var ClickToEditTimeView = (function (_super) {
        __extends(ClickToEditTimeView, _super);
        function ClickToEditTimeView() {
            _super.apply(this, arguments);
            this._displayFormat = "h:mm A";
            this._timeInputView = null;
        }
        Object.defineProperty(ClickToEditTimeView.prototype, "displayFormat", {
            get: function () {
                return this._displayFormat;
            },
            set: function (value) {
                this._displayFormat = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClickToEditTimeView.prototype, "timeInputView", {
            get: function () {
                return this._timeInputView;
            },
            set: function (value) {
                this._timeInputView = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClickToEditTimeView, "cssClass", {
            /**
            * The unique css class for this class.
            */
            get: function () {
                return ClickToEditBaseView.cssClass + ' clickToEditTimeView';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClickToEditTimeView.prototype, "inputType", {
            /**
            * The unique input type identifier associated with this type of input
            */
            get: function () {
                return ClickToEditType.time;
            },
            enumerable: true,
            configurable: true
        });

        ClickToEditTimeView.prototype.element = function ($form, settings) {
            var $input = $('<input>').addClass('form-control');
            $input.height(settings.height);
            $form.append($input);
            this.timeInputView = TimeInputView.fromJQuery($input);
            return $input;
        };

        /**
        * Set the value of the input to match the value of the contentString.
        */
        ClickToEditTimeView.prototype.content = function ($form, contentString, settings) {
            this.timeInputView.value = this._$el.data("logical_value") || this.timeInputView.value;
        };

        /**
        * Returns the string html value of the form value. Do processing
        * such as converting \n to <br>
        */
        ClickToEditTimeView.prototype.processFormValue = function (value, settings) {
            var logicalValue = this.timeInputView.value;
            this._$el.data('logical_value', logicalValue);
            this.timeInputView = null;
            return this.encodeDecodeProxy.htmlEncode(logicalValue.format(this.displayFormat));
        };
        return ClickToEditTimeView;
    })(ClickToEditBaseView);

    
    return ClickToEditTimeView;
});
//# sourceMappingURL=ClickToEditTimeView.js.map

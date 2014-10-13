/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './ClickToEditBaseView', './ClickToEditType', '../CustomInputs/DateInputView'], function(require, exports, $, ClickToEditBaseView, ClickToEditType, DateInputView) {
    var ClickToEditTimeView = (function (_super) {
        __extends(ClickToEditTimeView, _super);
        function ClickToEditTimeView() {
            _super.apply(this, arguments);
            this._displayFormat = 'MMMM D, YYYY';
            this._dateInputView = null;
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

        Object.defineProperty(ClickToEditTimeView.prototype, "dateInputView", {
            get: function () {
                return this._dateInputView;
            },
            set: function (value) {
                this._dateInputView = value;
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
                return ClickToEditType.date;
            },
            enumerable: true,
            configurable: true
        });

        ClickToEditTimeView.prototype.element = function ($form, settings) {
            var $input = $('<input>').addClass('form-control');
            $input.height(settings.height);
            $form.append($input);
            this.dateInputView = DateInputView.fromJQuery($input);
            return $input;
        };

        /**
        * Set the value of the input to match the value of the contentString.
        */
        ClickToEditTimeView.prototype.content = function ($form, contentString, settings) {
            this.dateInputView.value = this._$el.data("logical_value") || this.dateInputView.value;
        };

        /**
        * Returns the string html value of the form value. Do processing
        * such as converting \n to <br>
        */
        ClickToEditTimeView.prototype.processFormValue = function (value, settings) {
            var logicalValue = this.dateInputView.value;
            this._$el.data('logical_value', logicalValue);
            this.dateInputView = null;
            return this.encodeDecodeProxy.htmlEncode(logicalValue.format(this.displayFormat));
        };
        return ClickToEditTimeView;
    })(ClickToEditBaseView);

    
    return ClickToEditTimeView;
});
//# sourceMappingURL=ClickToEditDateView.js.map

/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './ClickToEditBaseView', './ClickToEditType'], function(require, exports, $, ClickToEditBaseView, ClickToEditType) {
    var ClickToEditSelectView = (function (_super) {
        __extends(ClickToEditSelectView, _super);
        function ClickToEditSelectView() {
            _super.apply(this, arguments);
            this._selectOptions = [];
        }
        Object.defineProperty(ClickToEditSelectView.prototype, "selectOptions", {
            get: function () {
                return this._selectOptions;
            },
            set: function (value) {
                this._selectOptions = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClickToEditSelectView, "cssClass", {
            /**
            * The unique css class for this class.
            */
            get: function () {
                return ClickToEditBaseView.cssClass + ' clickToEditSelectView';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ClickToEditSelectView.prototype, "inputType", {
            /**
            * The unique input type identifier associated with this type of input
            */
            get: function () {
                return ClickToEditType.select;
            },
            enumerable: true,
            configurable: true
        });

        ClickToEditSelectView.prototype.element = function ($form, settings) {
            // TODO need a list of values and display texts
            var $input = $('<select class="form-control">');
            this.selectOptions.map(function (option, index) {
                var $option = $('<option>');
                $option.attr('value', option.value);
                $option.text(option.displayText);
                $input.append($option);
            });

            // don't set the height, use default
            $form.append($input);
            return $input;
        };

        /**
        * Set the value of the input to match the value of the contentString.
        */
        ClickToEditSelectView.prototype.content = function ($form, contentString, settings) {
            var cur_val = this._$el.data("logical_value");
            if (cur_val === null || cur_val === undefined) {
                cur_val = contentString;
            }
            $form.find('select').val(cur_val);
        };

        /**
        * Returns the string html value of the form value. Do processing
        * such as converting \n to <br>
        */
        ClickToEditSelectView.prototype.processFormValue = function (value, settings) {
            var displayText = value;
            this.selectOptions.map(function (option) {
                if (value === option.value) {
                    displayText = option.displayText;
                }
            });
            this._$el.data('logical_value', value);
            return this.encodeDecodeProxy.htmlEncode(displayText);
        };
        return ClickToEditSelectView;
    })(ClickToEditBaseView);

    
    return ClickToEditSelectView;
});
//# sourceMappingURL=ClickToEditSelectView.js.map

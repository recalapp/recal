/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
/// <amd-dependency path="jeditable" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './ClickToEditBaseView', "jeditable"], function(require, exports, $, ClickToEditBaseView) {
    var ClickToEditTextView = (function (_super) {
        __extends(ClickToEditTextView, _super);
        function ClickToEditTextView() {
            _super.apply(this, arguments);
        }
        /**
        * The unique css class for this class.
        */
        ClickToEditTextView.prototype.cssClass = function () {
            return _super.prototype.cssClass.call(this) + ' clickToEditTextView';
        };

        /**
        * The unique input type identifier associated with this type of input
        */
        ClickToEditTextView.prototype.inputType = function () {
            return 'CTE_Text';
        };

        /**
        * Create a new input element and attach it to the form. Also return
        * the created element.
        */
        ClickToEditTextView.prototype.element = function ($form, settings) {
            var $input = $('<input>').addClass('form-control');
            $form.append($input);
            return $input;
        };
        return ClickToEditTextView;
    })(ClickToEditBaseView);
    
    return ClickToEditTextView;
});

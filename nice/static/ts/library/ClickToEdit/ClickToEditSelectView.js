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
        }
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

            // don't set the height, use default
            $form.append($input);
            return $input;
        };
        return ClickToEditSelectView;
    })(ClickToEditBaseView);

    
    return ClickToEditSelectView;
});
//# sourceMappingURL=ClickToEditSelectView.js.map

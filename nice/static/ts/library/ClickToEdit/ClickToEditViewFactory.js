/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", './ClickToEditCommon', './ClickToEditTextView', './ClickToEditTextAreaView', './ClickToEditType', '../Core/NotImplementedException'], function(require, exports, ClickToEditCommon, ClickToEditTextView, ClickToEditTextAreaView, ClickToEditType, NotImplementedException) {
    var ClickToEditViewFactory = (function () {
        function ClickToEditViewFactory() {
        }
        ClickToEditViewFactory.instance = function () {
            return this._instance;
        };

        ClickToEditViewFactory.prototype.fromJQuery = function ($element) {
            var type = $element.data(ClickToEditCommon.DataType) || 0 /* text */;
            switch (type) {
                case 0 /* text */:
                    return ClickToEditTextView.fromJQuery($element);
                case 1 /* textArea */:
                    return ClickToEditTextAreaView.fromJQuery($element);
                default:
                    throw new NotImplementedException('ClickToEditType ' + type + ' is not supported');
            }
        };
        ClickToEditViewFactory._instance = new ClickToEditViewFactory();
        return ClickToEditViewFactory;
    })();
    
    return ClickToEditViewFactory;
});

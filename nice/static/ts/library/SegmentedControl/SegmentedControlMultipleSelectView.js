/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SegmentedControlBaseView'], function(require, exports, SegmentedControlBaseView) {
    var SegmentedControlMultipleSelectView = (function (_super) {
        __extends(SegmentedControlMultipleSelectView, _super);
        function SegmentedControlMultipleSelectView() {
            _super.call(this, SegmentedControlMultipleSelectView.cssClass);
        }
        Object.defineProperty(SegmentedControlMultipleSelectView, "cssClass", {
            get: function () {
                return SegmentedControlBaseView.cssClass + ' segmentedControlMultipleSelectView';
            },
            enumerable: true,
            configurable: true
        });

        SegmentedControlMultipleSelectView.prototype.handleClickForChoice = function (choice) {
            choice.selected = !choice.selected;
        };

        /**
        * Provide multiple select behavior
        */
        SegmentedControlMultipleSelectView.prototype.fixChoices = function (mostRecent) {
            // it's the default behavior
        };
        return SegmentedControlMultipleSelectView;
    })(SegmentedControlBaseView);

    
    return SegmentedControlMultipleSelectView;
});
//# sourceMappingURL=SegmentedControlMultipleSelectView.js.map

/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SegmentedControlBaseView'], function(require, exports, SegmentedControlBaseView) {
    var SegmentedControlOptionalSingleSelectView = (function (_super) {
        __extends(SegmentedControlOptionalSingleSelectView, _super);
        function SegmentedControlOptionalSingleSelectView() {
            _super.call(this, SegmentedControlOptionalSingleSelectView.cssClass);
        }
        Object.defineProperty(SegmentedControlOptionalSingleSelectView, "cssClass", {
            get: function () {
                return SegmentedControlBaseView.cssClass + ' segmentedControlOptionalSingleSelectView';
            },
            enumerable: true,
            configurable: true
        });

        SegmentedControlOptionalSingleSelectView.prototype.handleClickForChoice = function (choice) {
            choice.selected = !choice.selected;
        };

        /**
        * Provide single select behavior
        */
        SegmentedControlOptionalSingleSelectView.prototype.fixChoices = function (mostRecent) {
            if (mostRecent === null || mostRecent === undefined) {
                // most recent is not given, defaults to the last choice
                mostRecent = this.choices.reduce(function (prevSelected, curVal) {
                    if (curVal.selected) {
                        return curVal;
                    } else {
                        return prevSelected;
                    }
                }, null);
            }
            this.choices.map(function (choice) {
                if (choice !== mostRecent) {
                    choice.selected = false;
                }
            });
        };
        return SegmentedControlOptionalSingleSelectView;
    })(SegmentedControlBaseView);

    
    return SegmentedControlOptionalSingleSelectView;
});
//# sourceMappingURL=SegmentedControlOptionalSingleSelectView.js.map

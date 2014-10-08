/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SegmentedControlBaseView'], function(require, exports, SegmentedControlBaseView) {
    var SegmentedControlSingleSelectView = (function (_super) {
        __extends(SegmentedControlSingleSelectView, _super);
        function SegmentedControlSingleSelectView() {
            _super.call(this, SegmentedControlSingleSelectView.cssClass);
        }
        Object.defineProperty(SegmentedControlSingleSelectView, "cssClass", {
            get: function () {
                return SegmentedControlBaseView.cssClass + ' segmentedControlSingleSelect';
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Provide single select behavior
        */
        SegmentedControlSingleSelectView.prototype.fixChoices = function (mostRecent) {
            if (mostRecent === null || mostRecent === undefined) {
                // most recent is not given, defaults to the last choice
                mostRecent = this.choices.reduce(function (prevSelected, curVal) {
                    if (curVal.selected) {
                        return curVal;
                    } else {
                        return prevSelected;
                    }
                }, this.choices[0]);
            }
            this.choices.map(function (choice) {
                if (choice !== mostRecent) {
                    choice.selected = false;
                }
            });
        };
        return SegmentedControlSingleSelectView;
    })(SegmentedControlBaseView);

    
    return SegmentedControlSingleSelectView;
});
//# sourceMappingURL=SegmentedControlSingleSelectView.js.map

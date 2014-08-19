/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './SegmentedControlBaseView'], function(require, exports, $, SegmentedControlBaseView) {
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
            this.choices[0].selected = true; // ok because we keep latest
            if (mostRecent === null || mostRecent === undefined) {
                // most recent is not given, defaults to the last choice
                $.each(this.choices, function (index, choice) {
                    if (choice.selected) {
                        mostRecent = choice;
                    }
                });
            }
            $.each(this.choices, function (index, choice) {
                if (choice !== mostRecent) {
                    choice.selected = false;
                }
            });
        };
        return SegmentedControlSingleSelectView;
    })(SegmentedControlBaseView);

    
    return SegmentedControlSingleSelectView;
});

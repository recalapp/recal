/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './SegmentedControlBaseView'], function(require, exports, $, SegmentedControlBaseView) {
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

        /**
        * Provide single select behavior
        */
        SegmentedControlOptionalSingleSelectView.prototype.fixChoices = function (mostRecent) {
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
        return SegmentedControlOptionalSingleSelectView;
    })(SegmentedControlBaseView);

    
    return SegmentedControlOptionalSingleSelectView;
});

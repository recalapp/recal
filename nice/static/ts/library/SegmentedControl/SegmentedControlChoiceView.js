/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../CoreUI/FocusableView', './SegmentedControlCommon'], function(require, exports, $, FocusableView, SegmentedControlCommon) {
    var SegmentedControlChoiceView = (function (_super) {
        __extends(SegmentedControlChoiceView, _super);
        function SegmentedControlChoiceView() {
            _super.call(this, SegmentedControlChoiceView.template, SegmentedControlChoiceView.cssClass);
            this._choice = null;
            this._highlighted = false;
        }
        Object.defineProperty(SegmentedControlChoiceView, "cssClass", {
            get: function () {
                return FocusableView.cssClass + ' segmentedControlChoiceView';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlChoiceView, "template", {
            get: function () {
                var $button = $('<button class="btn btn-sm">');
                return $button;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlChoiceView.prototype, "choice", {
            get: function () {
                return this._choice;
            },
            set: function (value) {
                this._choice = value;
                this.refresh();
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(SegmentedControlChoiceView.prototype, "highlighted", {
            get: function () {
                return this._highlighted;
            },
            set: function (value) {
                this._highlighted = value;
                this._highlighted ? this._$el.addClass('btn-primary') : this._$el.removeClass('btn-primary');
            },
            enumerable: true,
            configurable: true
        });


        SegmentedControlChoiceView.prototype.refresh = function () {
            if (this.choice === null || this.choice === undefined) {
                // should never be called
                this._$el.text('');
                return;
            }
            this._$el.text(this._choice.displayText);
            this._$el.attr('id', SegmentedControlCommon.prefix + this._choice.identifier);
            this.highlighted = this._choice.selected;
        };
        return SegmentedControlChoiceView;
    })(FocusableView);

    
    return SegmentedControlChoiceView;
});
//# sourceMappingURL=SegmentedControlChoiceView.js.map

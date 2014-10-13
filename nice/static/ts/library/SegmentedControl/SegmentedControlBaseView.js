/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../CoreUI/FocusableView', '../Core/InvalidActionException', './SegmentedControlChoiceView', './SegmentedControlCommon', '../CoreUI/View'], function(require, exports, $, BrowserEvents, FocusableView, InvalidActionException, SegmentedControlChoiceView, SegmentedControlCommon, View) {
    var SegmentedControlBaseView = (function (_super) {
        __extends(SegmentedControlBaseView, _super);
        function SegmentedControlBaseView(cssClass) {
            var _this = this;
            _super.call(this, SegmentedControlBaseView.template, cssClass);
            this._titleView = null;
            this._choicesView = null;
            /**
            * The title of the segmented control
            */
            this._title = null;
            /**
            * The choices for segmented control
            */
            this._choices = null;
            this.titleView = View.fromJQuery(this.findJQuery('#title'));
            this.titleView.removeAllChildren();
            this.choicesView = View.fromJQuery(this.findJQuery('#choices'));
            this.choicesView.removeAllChildren();
            this.choicesView.attachEventHandler(BrowserEvents.click, function (ev) {
                var $choice = $(ev.target).closest(SegmentedControlChoiceView.cssSelector());
                var choiceView = SegmentedControlChoiceView.fromJQuery($choice);
                _this.handleClickForChoice(choiceView.choice);
                _this.fixChoices(choiceView.choice);
                _this.renderChoices();
                _this.triggerEvent(BrowserEvents.segmentedControlSelectionChange);
            });
        }
        Object.defineProperty(SegmentedControlBaseView, "template", {
            get: function () {
                var $container = $('<div>').append($('<h5 id="title">'));
                $container.append($('<div id="choices" class="btn-group">'));
                return $container;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlBaseView, "cssClass", {
            get: function () {
                return FocusableView.cssClass + ' segmentedControlBase';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlBaseView.prototype, "titleView", {
            get: function () {
                return this._titleView;
            },
            set: function (value) {
                this._titleView = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlBaseView.prototype, "choicesView", {
            get: function () {
                return this._choicesView;
            },
            set: function (value) {
                this._choicesView = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlBaseView.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (value) {
                if (this._title !== value) {
                    this._title = value;
                    this.titleView._$el.text(this._title);
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlBaseView.prototype, "choices", {
            get: function () {
                return this._choices;
            },
            set: function (value) {
                if (value.length < 0) {
                    throw new InvalidActionException('Segmented control must have at least one choice');
                }
                this._choices = value;
                this.choicesView.removeAllChildren();
                this.fixChoices();

                // render
                this.renderChoices();
            },
            enumerable: true,
            configurable: true
        });

        /**
        * This method is called right after choice selection has changed.
        * Must be overidden in subclasses to get the right behavior (e.g.
        * single select vs multiple selects)
        */
        SegmentedControlBaseView.prototype.fixChoices = function (mostRecent) {
        };

        SegmentedControlBaseView.prototype.handleClickForChoice = function (choice) {
            choice.selected = true;
        };

        SegmentedControlBaseView.prototype.renderChoices = function () {
            var _this = this;
            this.choices.map(function (choice) {
                // get or create the button for this choice
                var $choice = _this.choicesView.findJQuery('#' + SegmentedControlCommon.prefix + choice.identifier);
                var choiceView;
                if ($choice.length === 0) {
                    // create
                    $choice = $('<button class="btn btn-sm">').attr('id', '#' + SegmentedControlCommon.prefix + choice.identifier);
                    choiceView = SegmentedControlChoiceView.fromJQuery($choice);
                    _this.choicesView.append(choiceView);
                } else {
                    // reuse
                    choiceView = SegmentedControlChoiceView.fromJQuery($choice);
                }

                // update view
                choiceView.choice = choice;
            });
        };
        return SegmentedControlBaseView;
    })(FocusableView);

    
    return SegmentedControlBaseView;
});
//# sourceMappingURL=SegmentedControlBaseView.js.map

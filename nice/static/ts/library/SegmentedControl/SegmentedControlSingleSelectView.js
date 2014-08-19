/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../CoreUI/FocusableView', '../Core/InvalidActionException', './SegmentedControlChoiceView', './SegmentedControlCommon', '../CoreUI/View'], function(require, exports, $, BrowserEvents, FocusableView, InvalidActionException, SegmentedControlChoiceView, SegmentedControlCommon, View) {
    var SegmentedControlSingleSelectView = (function (_super) {
        __extends(SegmentedControlSingleSelectView, _super);
        function SegmentedControlSingleSelectView() {
            var _this = this;
            _super.call(this, SegmentedControlSingleSelectView.template, SegmentedControlSingleSelectView.cssClass);
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
            this.choicesView.attachEventHandler(BrowserEvents.click, SegmentedControlChoiceView.cssSelector, function (ev) {
                var $choice = $(ev.target).closest(SegmentedControlChoiceView.cssSelector);
                var choiceView = SegmentedControlChoiceView.fromJQuery($choice);
                choiceView.choice.selected = true;
                _this.fixChoices(choiceView.choice);

                _this.triggerEvent(BrowserEvents.segmentedControlSelectionChange);
            });
        }
        Object.defineProperty(SegmentedControlSingleSelectView, "template", {
            get: function () {
                var $container = $('<div>').append($('<h5 id="title">'));
                $container.append($('<div id="choices" class="btn-group">'));
                return $container;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlSingleSelectView, "cssClass", {
            get: function () {
                return FocusableView.cssClass + ' segmentedControl';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlSingleSelectView.prototype, "titleView", {
            get: function () {
                return this._titleView;
            },
            set: function (value) {
                this._titleView = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlSingleSelectView.prototype, "choicesView", {
            get: function () {
                return this._choicesView;
            },
            set: function (value) {
                this._choicesView = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SegmentedControlSingleSelectView.prototype, "title", {
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

        Object.defineProperty(SegmentedControlSingleSelectView.prototype, "choices", {
            get: function () {
                return this._choices;
            },
            set: function (value) {
                if (value.length < 1) {
                    throw new InvalidActionException('Segmented control must have at least one choice');
                }
                this._choices = value;
                this.choicesView.removeAllChildren();

                // makes sure exactly one choice is selected
                this._choices[0].selected = true; // ok because we pick the last seen choice
                var lastSelected = null;
                $.each(this._choices, function (index, choice) {
                    if (choice.selected) {
                        lastSelected = choice;
                    }
                });
                this.fixChoices(lastSelected);

                // render
                this.renderChoices();
            },
            enumerable: true,
            configurable: true
        });

        SegmentedControlSingleSelectView.prototype.fixChoices = function (mostRecent) {
            $.each(this._choices, function (index, choice) {
                if (choice !== mostRecent) {
                    choice.selected = false;
                }
            });
        };

        SegmentedControlSingleSelectView.prototype.renderChoices = function () {
            var _this = this;
            $.each(this.choices, function (index, choice) {
                // get or create the button for this choice
                var $choice = _this.choicesView.findJQuery('#' + SegmentedControlCommon.prefix + choice.identifier);
                var choiceView;
                if ($choice.length === 0) {
                    // create
                    $choice = $('<button class="btn btn-sm">');
                    choiceView = SegmentedControlChoiceView.fromJQuery($choice);
                    _this.append(choiceView);
                } else {
                    // reuse
                    choiceView = SegmentedControlChoiceView.fromJQuery($choice);
                }

                // update view
                choiceView.choice = choice;
            });
        };
        return SegmentedControlSingleSelectView;
    })(FocusableView);

    
    return SegmentedControlSingleSelectView;
});

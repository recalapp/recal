/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './ActionSheetType', '../CoreUI/FocusableView', '../CoreUI/View'], function(require, exports, $, ActionSheetType, FocusableView, View) {
    var ActionSheetView = (function (_super) {
        __extends(ActionSheetView, _super);
        function ActionSheetView() {
            _super.call(this, ActionSheetView.template, ActionSheetView.cssClass);
            this._actionSheetPrefix = 'actionSheet_';
            this._title = null;
        }
        Object.defineProperty(ActionSheetView, "cssClass", {
            get: function () {
                return View.cssClass + ' actionSheetView';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ActionSheetView.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (value) {
                this._title = value;
                this.findJQuery('#actionSheetTitle').text(this._title);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(ActionSheetView, "template", {
            get: function () {
                var $template = $('<div>');
                $template.append($('<div id="actionSheetTitle">'));
                return $template;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ActionSheetView, "buttonTemplate", {
            get: function () {
                var $button = $('<div>').addClass('white-link-btn').addClass('prompt-btn theme');
                return $button;
            },
            enumerable: true,
            configurable: true
        });

        ActionSheetView.createButtonView = function () {
            return FocusableView.fromJQuery(ActionSheetView.buttonTemplate);
        };

        ActionSheetView.prototype.addChoice = function (choice) {
            var buttonView = ActionSheetView.createButtonView();
            buttonView._$el.attr('id', this._actionSheetPrefix + choice.identifier).text(choice.displayText);
            switch (choice.type) {
                case 1 /* important */:
                    buttonView._$el.addClass('no');
                    break;
                case 0 /* default */:
                    buttonView._$el.addClass('yes');
                    break;
            }
            this.append(buttonView);
        };
        return ActionSheetView;
    })(FocusableView);
    
    return ActionSheetView;
});

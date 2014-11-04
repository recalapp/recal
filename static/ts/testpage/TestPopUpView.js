/// <reference path="../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../library/ActionSheet/ActionSheetType', '../library/ActionSheet/ActionSheetView', '../library/Core/BrowserEvents', '../library/ClickToEdit/ClickToEditViewFactory', '../library/CoreUI/FocusableView', '../library/PopUp/PopUpView'], function(require, exports, $, ActionSheetType, ActionSheetView, BrowserEvents, ClickToEditViewFactory, FocusableView, PopUpView) {
    var TestPopUpView = (function (_super) {
        __extends(TestPopUpView, _super);
        function TestPopUpView(view) {
            _super.call(this, view, PopUpView.cssClass);
            this._$el.find('.clickToEdit').each(function (index, element) {
                var $element = $(element);
                var clickToEditView = ClickToEditViewFactory.instance().fromJQuery($element);
            });
            var closeButton = FocusableView.fromJQuery(this.findJQuery('#close_button'));
            closeButton.attachEventHandler(BrowserEvents.click, function (ev) {
                ev.preventDefault();
                var actionSheet = new ActionSheetView();
                actionSheet.title = 'Save changes?';
                actionSheet.addChoice({
                    identifier: 'no',
                    displayText: 'No',
                    type: 0 /* important */
                });
                actionSheet.addChoice({
                    identifier: 'yes',
                    displayText: 'Yes',
                    type: 1 /* default */
                });
                closeButton.showViewInPopover(actionSheet);
            });
        }
        return TestPopUpView;
    })(PopUpView);

    
    return TestPopUpView;
});

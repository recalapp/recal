/// <reference path="../typings/tsd.d.ts" />

import $ = require('jquery');

import ActionSheet = require('../library/ActionSheet/ActionSheet');
import ActionSheetType = require('../library/ActionSheet/ActionSheetType');
import ActionSheetView = require('../library/ActionSheet/ActionSheetView');
import BrowserEvents = require('../library/Core/BrowserEvents');
import ClickToEditViewFactory = require('../library/ClickToEdit/ClickToEditViewFactory');
import FocusableView = require('../library/CoreUI/FocusableView');
import PopUpView = require('../library/PopUp/PopUpView');

import IActionSheetView = ActionSheet.IActionSheetView;

class TestPopUpView extends PopUpView
{
    constructor(view : JQuery)
    {
        super(view, PopUpView.cssClass);
        this._$el.find('.clickToEdit').each((index: number, element) =>
                {
                    var $element = $(element);
                    var clickToEditView = ClickToEditViewFactory.instance().fromJQuery($element);
                });
        var closeButton: FocusableView = <FocusableView> FocusableView.fromJQuery(this.findJQuery('#close_button'));
        closeButton.attachEventHandler(BrowserEvents.click, (ev: JQueryEventObject)=>
        {
            ev.preventDefault();
            var actionSheet: IActionSheetView = new ActionSheetView();
            actionSheet.title = 'Are you sure you want to close?';
            actionSheet.addChoice({
                identifier: 'no',
                displayText: 'No',
                type: ActionSheetType.important
            });
            actionSheet.addChoice({
                identifier: 'yes',
                displayText: 'Yes',
                type: ActionSheetType.default
            });
            closeButton.showViewInPopover(actionSheet);
        });
    }
}

export = TestPopUpView;

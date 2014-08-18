/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import ActionSheet = require('./ActionSheet');
import ActionSheetType = require('./ActionSheetType');
import CoreUI = require('../CoreUI/CoreUI');
import FocusableView = require('../CoreUI/FocusableView');
import View = require('../CoreUI/View');

import IActionSheetChoice = ActionSheet.IActionSheetChoice;
import IActionSheetView = ActionSheet.IActionSheetView;
import IFocusableView = CoreUI.IFocusableView;



class ActionSheetView extends FocusableView implements IActionSheetView
{
    public static get cssClass(): string
    {
        return View.cssClass + ' actionSheetView';
    }

    private _actionSheetPrefix = 'actionSheet_'; // avoid conflicts with other modules when giving ids/classes

    private _title: string = null;

    public get title(): string
    {
        return this._title;
    }
    public set title(value: string)
    {
        this._title = value;
        this.findJQuery('#actionSheetTitle').text(this._title);
    }

    private static get template(): JQuery
    {
        var $template = $('<div>');
        $template.append($('<div id="actionSheetTitle">'));
        return $template;
    }
    private static get buttonTemplate(): JQuery
    {
        var $button = $('<div>').addClass('white-link-btn').addClass('prompt-btn theme');
        return $button;
    }

    constructor()
    {
        super(ActionSheetView.template, ActionSheetView.cssClass);
    }

    private static createButtonView(): IFocusableView
    {
        return <FocusableView> FocusableView.fromJQuery(ActionSheetView.buttonTemplate);
    }

    public addChoice(choice: IActionSheetChoice): void
    {
        var buttonView: IFocusableView = ActionSheetView.createButtonView();
        (<FocusableView> buttonView)._$el.attr('id', this._actionSheetPrefix + choice.identifier).text(choice.displayText);
        switch(choice.type)
        {
            case ActionSheetType.important:
                (<FocusableView> buttonView)._$el.addClass('no');
                break;
            case ActionSheetType.default:
                (<FocusableView> buttonView)._$el.addClass('yes');
                break;
        }
        this.append(buttonView);
    }
}
export = ActionSheetView;

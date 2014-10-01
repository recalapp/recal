/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import ClickToEdit = require('./ClickToEdit');
import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditCommon = require('./ClickToEditCommon');
import ClickToEditSelectView = require('./ClickToEditSelectView');
import ClickToEditTextView = require('./ClickToEditTextView');
import ClickToEditTextAreaView = require('./ClickToEditTextAreaView');
import ClickToEditTimeView = require('./ClickToEditTimeView');
import ClickToEditType = require('./ClickToEditType');
import NotImplementedException = require('../Core/NotImplementedException');
import Set = require('../DataStructures/Set');

import IClickToEditView = ClickToEdit.IClickToEditView;

class ClickToEditViewFactory
{
    private _customTypes = new Set<string>();
    private get customTypes(): Set<string> { return this._customTypes; }


    /**
     * Create a new ClickToEditView instance. $element must have data-cte_type
     * set to a number that correspondsto the enum representing
     * clickToEditType.
     */
    public createFromJQuery($element: JQuery): IClickToEditView
    {
        var type = $element.data(ClickToEditCommon.DataType)
            || ClickToEditType.text;
        if (!this.customTypes.contains(type))
        {
            // initialize the custom type
            this.customTypes.add(type);

            // NOTE this = form in the context of functions
            $.editable.addInputType(type, {
                element: function (settings, original)
                {
                    // ok to do this because we assume the view is
                    // already initialized, so the created instance
                    // will be of the correct ClickToEdit type.
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    // this in here refers to the form. we are using function(),
                    // not a lambda, so the context changes.
                    return view.element($(this), settings);
                },
                content: function (contentString, settings, original)
                {
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    return view.content($(this), contentString, settings);
                },
                plugin: function (settings, original)
                {
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    return view.plugin($(this), settings);
                },
            });
        }
        var clickToEditView: IClickToEditView = null;
        switch (type)
        {
            case ClickToEditType.text:
                clickToEditView =
                <ClickToEditTextView> ClickToEditTextView.fromJQuery($element);
                break;
            case ClickToEditType.textArea:
                clickToEditView =
                <ClickToEditTextAreaView> ClickToEditTextAreaView.fromJQuery($element);
                break;
            case ClickToEditType.select:
                clickToEditView =
                <ClickToEditSelectView> ClickToEditSelectView.fromJQuery($element);
                break;
            case ClickToEditType.time:
                clickToEditView =
                <ClickToEditTimeView> ClickToEditTimeView.fromJQuery($element);
                break;
            default:
                throw new NotImplementedException('ClickToEditType ' + type
                    + ' is not supported');
                break;
        }

        return clickToEditView;
    }
}
export = ClickToEditViewFactory;

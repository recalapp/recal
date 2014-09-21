/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditCommon = require('./ClickToEditCommon');
import ClickToEditTextView = require('./ClickToEditTextView');
import ClickToEditTextAreaView = require('./ClickToEditTextAreaView');
import ClickToEditType = require('./ClickToEditType');
import NotImplementedException = require('../Core/NotImplementedException');
import Set = require('../DataStructures/Set');

class ClickToEditViewFactory
{
    private _customTypes = new Set<string>();
    private get customTypes(): Set<string> { return this._customTypes; }

    public fromJQuery($element: JQuery) : ClickToEditBaseView
    {
        var type = $element.data(ClickToEditCommon.DataType) || ClickToEditType.text;
        var clickToEditView: ClickToEditBaseView = null;
        switch(type)
        {
            case ClickToEditType.text:
                clickToEditView = <ClickToEditTextView> ClickToEditTextView.fromJQuery($element);
            case ClickToEditType.textArea:
                clickToEditView = <ClickToEditTextAreaView> ClickToEditTextAreaView.fromJQuery($element);
            default:
                throw new NotImplementedException('ClickToEditType ' + type + ' is not supported');
        }
        if (!this.customTypes.contains(clickToEditView.inputType))
        {
            // initialize the custom type
            this.customTypes.add(clickToEditView.inputType);

            // NOTE this = form in the context of functions
            $.editable.addInputType(clickToEditView.inputType, {
                element: function(settings, original) {
                    // ok to do this because we assume the view is
                    // already initialized, so the created instance
                    // will be of the correct ClickToEdit type.
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    // this in here refers to the form. we are using function(),
                    // not a lambda, so the context changes.
                    return view.element($(this), settings);
                },
                content: function(contentString, settings, original){
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    return view.content($(this), contentString, settings);
                },
                plugin: function(settings, original){
                    var view = <ClickToEditBaseView> ClickToEditBaseView.fromJQuery($(original));
                    return view.plugin($(this), settings);
                },
            });
        }
        return clickToEditView;
    }
}
export = ClickToEditViewFactory;

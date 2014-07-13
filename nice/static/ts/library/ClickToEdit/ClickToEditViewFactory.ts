/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import ClickToEditBaseView = require('./ClickToEditBaseView');
import ClickToEditCommon = require('./ClickToEditCommon');
import ClickToEditTextView = require('./ClickToEditTextView');
import ClickToEditTextAreaView = require('./ClickToEditTextAreaView');
import ClickToEditType = require('./ClickToEditType');
import NotImplementedException = require('../Core/NotImplementedException');

class ClickToEditViewFactory
{
    private static _instance = new ClickToEditViewFactory();
    public static instance() : ClickToEditViewFactory
    {
        return this._instance;
    }

    public fromJQuery($element: JQuery) : ClickToEditBaseView
    {
        var type = $element.data(ClickToEditCommon.DataType) || ClickToEditType.text;
        switch(type)
        {
            case ClickToEditType.text:
                return <ClickToEditBaseView> ClickToEditTextView.fromJQuery($element);
            case ClickToEditType.textArea:
                return <ClickToEditBaseView> ClickToEditTextAreaView.fromJQuery($element);
            default:
                throw new NotImplementedException('ClickToEditType ' + type + ' is not supported');
        }
    }
}
export = ClickToEditViewFactory;

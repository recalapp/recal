/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
/// <amd-dependency path="jeditable" />

import $ = require('jquery');

import ClickToEditType = require('./ClickToEditType');
import NotImplementedException = require('../Core/NotImplementedException');

var TEXT_TYPE = 'RCText';
var TEXT_AREA_TYPE = 'RCTextArea';

function br2nl(text)
{
    return text.replace(/(\n|\r)/g, "").replace(/<br>/g, "\n"); // g = replace all occurences
}

$.editable.addInputType(TEXT_TYPE, {
    element: function(settings, original){
        var $input = $('<input>').addClass('form-control');
        $(this).append($input);
        return $input;
    },
});
$.editable.addInputType(TEXT_AREA_TYPE, {
    element: function(settings, original){
        var $input = $('<textarea>').addClass('form-control');
        $(this).append($input);
        return $input;
    },
    content: function(settings, original){
        var encoded = br2nl($(original).html());
        encoded = $('<div>').html(encoded).text();
        $(this).find('textarea').val(encoded);
        // TODO handle saving logic in the clicktoedit view class
    },
});

class ClickToEditTypeProvider
{
    private static _instance = new ClickToEditTypeProvider();
    public static instance() : ClickToEditTypeProvider
    {
        return this._instance;
    }

    public getTypeString(type: ClickToEditType) : string
    {
        switch(type)
        {
            case ClickToEditType.text:
                return TEXT_TYPE;
            case ClickToEditType.textArea:
                return TEXT_AREA_TYPE;
            default:
                throw new NotImplementedException('Type ' + type + ' is not supported');
        }
    }
}
export = ClickToEditTypeProvider;

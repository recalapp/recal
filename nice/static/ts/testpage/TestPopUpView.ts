/// <reference path="../typings/tsd.d.ts" />

import $ = require('jquery');

import ClickToEditView = require('../library/ClickToEdit/ClickToEditView');
import PopUpView = require('../library/PopUp/PopUpView');

class TestPopUpView extends PopUpView
{
    constructor(view : JQuery)
    {
        super(view);
        this._$el.find('.clickToEdit').each((index: number, element) =>
                {
                    var $element = $(element);
                    var clickToEditView = ClickToEditView.fromJQuery($element);
                });
    }
}

export = TestPopUpView;

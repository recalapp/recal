/// <reference path="../typings/tsd.d.ts" />

import $ = require('jquery');

import ClickToEditViewFactory = require('../library/ClickToEdit/ClickToEditViewFactory');
import PopUpView = require('../library/PopUp/PopUpView');

class TestPopUpView extends PopUpView
{
    constructor(view : JQuery)
    {
        super(view);
        this._$el.find('.clickToEdit').each((index: number, element) =>
                {
                    var $element = $(element);
                    var clickToEditView = ClickToEditViewFactory.instance().fromJQuery($element);
                });
    }
}

export = TestPopUpView;

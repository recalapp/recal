/// <reference path="../typings/tsd.d.ts" />
import $ = require('jquery');
import PopUpContainerViewController = require('../library/PopUp/PopUpContainerViewController');
import PopUpView = require('../library/PopUp/PopUpView');
import TestPopUpView = require('./TestPopUpView');
import View = require('../library/CoreUI/View');

var containerView = View.fromJQuery($('#content'));
var containerVC = new PopUpContainerViewController(containerView);

(<any>window).addPopUp = function()
{
    var popUpView = TestPopUpView.fromJQuery($(popUpString));
    containerView.append(popUpView);
}

var $popUpTemplateContainer = $('#popup-template');
var popUpString = $popUpTemplateContainer.children()[0];
$popUpTemplateContainer.remove();

(<any>window).addPopUp();

/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
class PopUpCommon
{
    public static cssClass = 'popup';
    public static cssSelector = '.' + PopUpCommon.cssClass;
    public static allDescendentsSelector = PopUpCommon.cssSelector + ' *';
    public static headingCssSelector = '.panel-heading';
    public static panelCssSelector = '.panel';
    public static focusOpacity = 1;
    public static blurOpacity = 0.6;
    public static focusClass = 'panel-primary';
    public static blurClass = 'panel-default';
}

export = PopUpCommon;

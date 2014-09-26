/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import IndicatorView = require('./IndicatorView');

class PersistentIndicatorView extends IndicatorView
{
    private static get template(): JQuery
    {
        var $template = $('<div class="indicator alert alert-dismissable alert-info">');
        $template.append($('<span id="loading-content">'));
        return $template;
    }

    public static get cssClass(): string
    {
        return IndicatorView.cssClass + ' persistentIndicatorView';
    }

    constructor(identifier: string, displayText: string, encoded: boolean = false)
    {
        super(PersistentIndicatorView.template, PersistentIndicatorView.cssClass, identifier);
        if (encoded)
        {
            this.findJQuery('#loading-content').html(displayText);
        }
        else
        {
            this.findJQuery('#loading-content').text(displayText);
        }
    }
}

export = PersistentIndicatorView;
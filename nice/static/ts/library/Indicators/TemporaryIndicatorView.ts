/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import IndicatorView = require('./IndicatorView');

class TemporaryIndicatorView extends IndicatorView
{
    private static get template(): JQuery
    {
        var $template = $('<div class="indicator alert alert-dismissable alert-success">');
        $template.append($('<span id="loading-content">'));
        return $template;
    }

    public static get cssClass(): string
    {
        return IndicatorView.cssClass + ' temporaryIndicatorView';
    }

    constructor(identifier: string, displayText: string, encoded: boolean = false)
    {
        super(TemporaryIndicatorView.template, TemporaryIndicatorView.cssClass, identifier);
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

export = TemporaryIndicatorView;

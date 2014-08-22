/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import CoreUI = require('./CoreUI');
import Dictionary = require('../DataStructures/Dictionary');

import IViewTemplateRetriever = CoreUI.IViewTemplateRetriever;

class ViewTemplateRetriever implements IViewTemplateRetriever
{
    private _cachedTemplates = new Dictionary<string, string>();

    /**
      * Retrieve the template belonging to the container selector as a 
      * jQuery object. Creates a new one every time.
      */
    public retrieveTemplate(containerSelector: string): JQuery
    {
        var templateString = this._cachedTemplates.get(containerSelector);
        if (templateString === null)
        {
            templateString = $(containerSelector).html();
            this._cachedTemplates.set(containerSelector, templateString);
        }
        return $(templateString);
    }
}
export = ViewTemplateRetriever;

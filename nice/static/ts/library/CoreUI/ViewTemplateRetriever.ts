/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import Dictionary = require('../DataStructures/Dictionary');

class ViewTemplateRetriever
{
    private _cachedTemplates = new Dictionary<string, string>();
    private static _instance = new ViewTemplateRetriever();
    public static instance(): ViewTemplateRetriever
    {
        return this._instance;
    }

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

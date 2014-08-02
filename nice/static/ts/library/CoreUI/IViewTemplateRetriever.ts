/// <reference path="../../typings/tsd.d.ts" />

interface IViewTemplateRetriever
{
    /**
      * Retrieve the template belonging to the container selector as a 
      * jQuery object. Creates a new one every time.
      */
    retrieveTemplate(containerSelector: string): JQuery;
}
export = IViewTemplateRetriever;

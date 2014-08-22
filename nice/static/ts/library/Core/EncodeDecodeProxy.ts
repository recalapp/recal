/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');

class EncodeDecodeProxy 
{
    private static _instance = new EncodeDecodeProxy();
    public static get instance() : EncodeDecodeProxy
    {
        return this._instance;
    }

    public htmlEncode(content: string) : string
    {
        return $('<div>').text(content).html();
    }

    public htmlDecode(content: string) : string
    {
        return $('<div>').html(content).text();
    }

    public newLinesToBr(content: string) : string
    {
        // equavalent to nl2br in php
        return content.replace(/(\n|\r)/g, "<br>");
    }

    public brToNewLines(content: string) : string
    {
        return content.replace(/(\n|\r)/g, "").replace(/<br>/g, "\n"); // g = replace all occurences
    }
}
export = EncodeDecodeProxy;

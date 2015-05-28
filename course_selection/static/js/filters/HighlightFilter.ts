/// <reference path='../../ts/typings/tsd.d.ts' />

'use strict';

import ICourse = require('../interfaces/ICourse');
import Filter = require('./Filter');

class HighlightFilter extends Filter
{
    // TODO: use this $injection
    public static $inject = ['$sce'];

    constructor(private $sce) {
        super();
    }

    /*
     * text is the text to be potentially highlighted
     * query is the query string, possibly containing multiple queries
     */
    public filter(text: string, query: string): string {
        if (!text || !query) {
            return this.$sce.trustAsHtml(text);
        }

        if (query.length < 3 && !this.isCourseNumber(text)) {
            return this.$sce.trustAsHtml(text);
        }

        var termsToHighlight = query.split(' ');
        text = text.replace(
            new RegExp('(' + termsToHighlight.join('|') + ')', 'gi'),
            '<span class="highlighted">$&</span>'
            );

        // return text;
        return this.$sce.trustAsHtml(text);
    }

    // we want to check if the input is a title or course number
    // because we don't want to highlight letters in titles unless
    // the input is long
    private isCourseNumber(input: string): boolean {
        return input.length >= 6 && !isNaN(+input.substring(3, 6));
    }
}

export = HighlightFilter;

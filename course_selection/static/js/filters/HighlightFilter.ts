/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

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

    public filter(text: string, input: string): string {
        if (!text || !input) {
            return text;
        }

        var termsToHighlight = input.split(' ');
        text = text.replace(
            new RegExp('(' + termsToHighlight.join('|') + ')', 'gi'),
            '<span class="highlighted">$&</span>'
            );

        // return text;
        return this.$sce.trustAsHtml(text);
    }
}

export = HighlightFilter;

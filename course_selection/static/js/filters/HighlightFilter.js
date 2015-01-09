/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Filter'], function(require, exports, Filter) {
    var HighlightFilter = (function (_super) {
        __extends(HighlightFilter, _super);
        function HighlightFilter($sce) {
            _super.call(this);
            this.$sce = $sce;
        }
        /*
        * text is the text to be potentially highlighted
        * query is the query string, possibly containing multiple queries
        */
        HighlightFilter.prototype.filter = function (text, query) {
            if (!text || !query) {
                return this.$sce.trustAsHtml(text);
            }

            if (query.length < 3 && !this.isCourseNumber(text)) {
                return this.$sce.trustAsHtml(text);
            }

            var termsToHighlight = query.split(' ');
            text = text.replace(new RegExp('(' + termsToHighlight.join('|') + ')', 'gi'), '<span class="highlighted">$&</span>');

            // return text;
            return this.$sce.trustAsHtml(text);
        };

        // we want to check if the input is a title or course number
        // because we don't want to highlight letters in titles unless
        // the input is long
        HighlightFilter.prototype.isCourseNumber = function (input) {
            return input.length >= 6 && !isNaN(+input.substring(3, 6));
        };
        HighlightFilter.$inject = ['$sce'];
        return HighlightFilter;
    })(Filter);

    
    return HighlightFilter;
});

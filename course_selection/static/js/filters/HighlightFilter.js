/// <reference path='../../ts/typings/tsd.d.ts' />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './Filter'], function (require, exports, Filter) {
    var HighlightFilter = (function (_super) {
        __extends(HighlightFilter, _super);
        function HighlightFilter($sce) {
            _super.call(this);
            this.$sce = $sce;
        }
        HighlightFilter.prototype.filter = function (text, query) {
            if (!text || !query) {
                return this.$sce.trustAsHtml(text);
            }
            if (query.length < 3 && !this.isCourseNumber(text)) {
                return this.$sce.trustAsHtml(text);
            }
            var termsToHighlight = query.split(' ');
            text = text.replace(new RegExp('(' + termsToHighlight.join('|') + ')', 'gi'), '<span class="highlighted">$&</span>');
            return this.$sce.trustAsHtml(text);
        };
        HighlightFilter.prototype.isCourseNumber = function (input) {
            return input.length >= 6 && !isNaN(+input.substring(3, 6));
        };
        HighlightFilter.$inject = ['$sce'];
        return HighlightFilter;
    })(Filter);
    return HighlightFilter;
});

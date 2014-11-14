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
        HighlightFilter.prototype.filter = function (text, input) {
            if (!text || !input) {
                return text;
            }

            var termsToHighlight = input.split(' ');
            text = text.replace(new RegExp('(' + termsToHighlight.join('|') + ')', 'gi'), '<span class="highlighted">$&</span>');

            // return text;
            return this.$sce.trustAsHtml(text);
        };
        HighlightFilter.$inject = ['$sce'];
        return HighlightFilter;
    })(Filter);

    
    return HighlightFilter;
});

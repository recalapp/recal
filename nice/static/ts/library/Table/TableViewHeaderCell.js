var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './TableViewCell', './TableViewCommon'], function(require, exports, TableViewCell, TableViewCommon) {
    var TableViewHeaderCell = (function (_super) {
        __extends(TableViewHeaderCell, _super);
        function TableViewHeaderCell($element) {
            _super.call(this, $element);

            // opt out of the click/selection functionality
            this._$el.removeClass(TableViewCommon.cellCssClass);
        }
        Object.defineProperty(TableViewHeaderCell.prototype, "selected", {
            // headers cannot be selected
            get: function () {
                return false;
            },
            set: function (value) {
                return;
            },
            enumerable: true,
            configurable: true
        });
        return TableViewHeaderCell;
    })(TableViewCell);
    
    return TableViewHeaderCell;
});

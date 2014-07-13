var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CoreUI/FocusableView'], function(require, exports, FocusableView) {
    var TableViewCell = (function (_super) {
        __extends(TableViewCell, _super);
        function TableViewCell() {
            _super.apply(this, arguments);
            this._indexPath = null;
        }
        Object.defineProperty(TableViewCell.prototype, "indexPath", {
            get: function () {
                return this._indexPath;
            },
            set: function (newValue) {
                this._indexPath = newValue;
            },
            enumerable: true,
            configurable: true
        });

        return TableViewCell;
    })(FocusableView);
    
    return TableViewCell;
});

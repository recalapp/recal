var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CoreUI/View'], function(require, exports, View) {
    var TableViewHeaderView = (function (_super) {
        __extends(TableViewHeaderView, _super);
        function TableViewHeaderView() {
            _super.apply(this, arguments);
            this._section = null;
        }
        Object.defineProperty(TableViewHeaderView, "cssClass", {
            /**
            * The unique css class for this class.
            */
            get: function () {
                return View.cssClass + ' tableViewHeaderView';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TableViewHeaderView.prototype, "section", {
            get: function () {
                return this._section;
            },
            set: function (newValue) {
                this._section = newValue;
            },
            enumerable: true,
            configurable: true
        });
        return TableViewHeaderView;
    })(View);
    
    return TableViewHeaderView;
});

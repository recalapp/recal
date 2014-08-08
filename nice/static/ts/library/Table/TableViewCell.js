/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Core/BrowserEvents', '../CoreUI/FocusableView', './TableViewCommon'], function(require, exports, BrowserEvents, FocusableView, TableViewCommon) {
    var TableViewCell = (function (_super) {
        __extends(TableViewCell, _super);
        function TableViewCell($element) {
            _super.call(this, $element);
            this._indexPath = null;
            this._selected = false;
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

        Object.defineProperty(TableViewCell.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (value) {
                if (this._selected === value) {
                    return;
                }
                this._selected = value;
                if (this.selected) {
                    this.highlight();
                } else {
                    this.unhighlight();
                }
                this.triggerEvent(BrowserEvents.tableViewCellSelectionChanged);
            },
            enumerable: true,
            configurable: true
        });

        /**
        * The unique css class for this class.
        */
        TableViewCell.prototype.cssClass = function () {
            return _super.prototype.cssClass.call(this) + ' ' + TableViewCommon.cellCssClass;
        };

        TableViewCell.prototype.highlight = function () {
        };

        TableViewCell.prototype.unhighlight = function () {
        };
        return TableViewCell;
    })(FocusableView);
    
    return TableViewCell;
});

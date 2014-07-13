/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../DataStructures/Dictionary', '../Core/IndexPath', '../CoreUI/View'], function(require, exports, Dictionary, IndexPath, View) {
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView($element, dataSource) {
            _super.call(this, $element);
            this._cellDict = new Dictionary();
            this._dataSource = null;
            this._dataSource = dataSource;
            this.refresh();
        }
        Object.defineProperty(TableView.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            enumerable: true,
            configurable: true
        });

        TableView.prototype.refresh = function () {
            this._cellDict = new Dictionary();
            this.removeAllChildren();
            for (var section = 0; section < this.dataSource.numberOfSections(); section++) {
                for (var item = 0; item < this.dataSource.numberOfItemsInSection(section); item++) {
                    var indexPath = new IndexPath(section, item);
                    var identifier = this.dataSource.identifierForCellAtIndexPath(indexPath);
                    var cell = this.dataSource.createCell(identifier);
                    cell.indexPath = indexPath;
                    this._cellDict.set(indexPath, cell);
                    this.append(cell);
                }
            }
        };

        TableView.prototype.cellForIndexPath = function (indexPath) {
            return this._cellDict.get(indexPath);
        };
        return TableView;
    })(View);

    
    return TableView;
});

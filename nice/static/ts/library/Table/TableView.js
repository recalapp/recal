/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../DataStructures/Dictionary', '../Core/IndexPath', '../Core/InvalidActionException', './TableViewCommon', '../CoreUI/View'], function(require, exports, $, BrowserEvents, Dictionary, IndexPath, InvalidActionException, TableViewCommon, View) {
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView($element) {
            var _this = this;
            _super.call(this, $element);
            this._cellDict = new Dictionary();
            this._dataSource = null;
            this._delegate = null;
            this.attachEventHandler(BrowserEvents.click, TableViewCommon.CellAllDescendentsSelector, function (ev) {
                var cell = TableViewCommon.findCellFromChild($(ev.target));
                if (cell === null) {
                    return;
                }

                // TODO(naphatkrit) handle single selection. multiple selection supported by default
                if (cell.selected) {
                    _this.deselectCell(cell);
                    if (_this.delegate !== null) {
                        _this.delegate.didDeselectCell(cell);
                    }
                } else {
                    _this.selectCell(cell);
                    if (_this.delegate !== null) {
                        _this.delegate.didSelectCell(cell);
                    }
                }
            });
        }
        Object.defineProperty(TableView.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            set: function (value) {
                if (value != this._dataSource) {
                    this._dataSource = value;
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TableView.prototype, "delegate", {
            get: function () {
                return this._delegate;
            },
            set: function (value) {
                this._delegate = value;
            },
            enumerable: true,
            configurable: true
        });

        TableView.prototype.refresh = function () {
            if (this.dataSource === null) {
                return;
            }
            this._cellDict = new Dictionary();
            this.removeAllChildren();
            for (var section = 0; section < this.dataSource.numberOfSections(); section++) {
                for (var item = 0; item < this.dataSource.numberOfItemsInSection(section); item++) {
                    var indexPath = new IndexPath(section, item);
                    var identifier = this.dataSource.identifierForCellAtIndexPath(indexPath);
                    var cell = this.dataSource.createCell(identifier);
                    cell.indexPath = indexPath;
                    cell = this.dataSource.decorateCell(cell);
                    this._cellDict.set(indexPath, cell);
                    this.append(cell);
                }
            }
        };

        TableView.prototype.cellForIndexPath = function (indexPath) {
            return this._cellDict.get(indexPath);
        };

        TableView.prototype.selectCellAtIndexPath = function (indexPath) {
            var cell = this._cellDict.get(indexPath);
            if (cell === null) {
                throw new InvalidActionException('IndexPath ' + indexPath.toString() + ' not in TableView');
            }
            this.selectCell(cell);
        };

        TableView.prototype.selectCell = function (cell) {
            cell.selected = true; // TODO(naphatkrit) what if already true?
        };

        TableView.prototype.deselectCellAtIndexPath = function (indexPath) {
            var cell = this._cellDict.get(indexPath);
            if (cell === null) {
                throw new InvalidActionException('IndexPath ' + indexPath.toString() + ' not in TableView');
            }
            this.deselectCell(cell);
        };

        TableView.prototype.deselectCell = function (cell) {
            cell.selected = false; // TODO(naphatkrit) what if already false?
        };
        return TableView;
    })(View);

    
    return TableView;
});

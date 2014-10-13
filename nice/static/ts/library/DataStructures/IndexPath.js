define(["require", "exports"], function(require, exports) {
    var IndexPath = (function () {
        function IndexPath(_section, _item) {
            this._section = _section;
            this._item = _item;
        }
        IndexPath.prototype.equals = function (other) {
            return this.section === other.section && this.item === other.item;
        };

        Object.defineProperty(IndexPath.prototype, "section", {
            get: function () {
                return this._section;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(IndexPath.prototype, "item", {
            get: function () {
                return this._item;
            },
            enumerable: true,
            configurable: true
        });

        IndexPath.prototype.toString = function () {
            return this.section + ', ' + this.item;
        };
        return IndexPath;
    })();
    
    return IndexPath;
});
//# sourceMappingURL=IndexPath.js.map

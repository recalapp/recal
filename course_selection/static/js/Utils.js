/// <reference path='../ts/typings/tsd.d.ts' />
define(["require", "exports"], function (require, exports) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.idxInList = function (element, list, comp) {
            var idx = Utils.NOT_FOUND;
            var comp = comp ? comp : this._defaultComp;
            angular.forEach(list, function (value, key) {
                if (comp(element, value)) {
                    idx = key;
                    return;
                }
            });
            return idx;
        };
        Utils.removeFromList = function (element, list, comp) {
            var idx = Utils.idxInList(element, list, comp);
            return list.splice(idx, 1);
        };
        Utils._defaultComp = function (a, b) {
            return a == b;
        };
        Utils.isInList = function (element, list, comp) {
            return this.idxInList(element, list, comp) != Utils.NOT_FOUND;
        };
        Utils.NOT_FOUND = -1;
        return Utils;
    })();
    return Utils;
});

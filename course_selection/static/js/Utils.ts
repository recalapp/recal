/// <reference path='../ts/typings/tsd.d.ts' />

class Utils {
    private static NOT_FOUND: number = -1;

    public static idxInList(element, list, comp?) {
        var idx = Utils.NOT_FOUND;
        var comp = comp ? comp : this._defaultComp;
        angular.forEach(list, (value, key) => {
            if (comp(element, value)) {
                idx = key;
                return;
            }
        });

        return idx;
    }

    public static _defaultComp(a, b): boolean {
        return a == b;
    }

    public static isInList(element, list, comp?): boolean {
        return this.idxInList(element, list, comp) != Utils.NOT_FOUND;
    }
}

export = Utils;

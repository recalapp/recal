/// <reference path='../ts/typings/tsd.d.ts' />

import IUser = require('./interfaces/IUser');

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

    public static removeFromList(element, list, comp?) {
        var idx = Utils.idxInList(element, list, comp);
        return list.splice(idx, 1);
    }

    public static _defaultComp(a, b): boolean {
        return a == b;
    }

    public static userComp(a: IUser, b: IUser): boolean {
        return a.netid == b.netid;
    }

    public static isInList(element, list, comp?): boolean {
        return this.idxInList(element, list, comp) != Utils.NOT_FOUND;
    }

    public static isVisible(element): boolean {
        return element && element.is(":visible");
    }
}

export = Utils;

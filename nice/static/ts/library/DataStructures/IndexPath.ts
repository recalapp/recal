import Equatable = require('../Core/Equatable');
class IndexPath implements Equatable
{
    equals(other: IndexPath): boolean
    {
        return this.section === other.section && this.item === other.item;
    }
    constructor(private _section, private _item)
    {
    }

    get section() : number
    {
        return this._section;
    }

    get item() : number
    {
        return this._item;
    }

    public toString() : string
    {
        return this.section + ', ' + this.item;
    }
}
export = IndexPath;

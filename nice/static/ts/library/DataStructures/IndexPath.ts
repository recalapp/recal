class IndexPath
{
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

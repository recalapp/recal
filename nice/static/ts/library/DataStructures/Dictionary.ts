class Dictionary<K, V>
{
    private _dict = {};

    /**
      * Set the value in the dictionary, and return the old value (null
      * no old value)
      */
    set(key : K, value : V) : Object
    {
        var ret : Object = null;
        if (this.contains(key))
        {
            ret = this.get(key);
        }
        this._dict[key.toString()] = value;
        return ret;
    }

    contains(key : K) : boolean
    {
        return key.toString() in this._dict;
    }

    get(key : K)
    {
        return this.contains(key) ? this._dict[key.toString()] : null;
    }

    allKeys() : Array<K>
    {
        var ret = Array<K>();
        for (var key in this._dict)
        {
            ret.push(key);
        }
        return ret;
    }
}
export=Dictionary;

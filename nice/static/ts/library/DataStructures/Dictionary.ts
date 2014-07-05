class Wrapper<K, V> 
{
    constructor(public key: K, public value: V)
    {
    }
}
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
        this._dict[key.toString()] = new Wrapper<K, V>(key, value);
        return ret;
    }

    contains(key : K) : boolean
    {
        return key.toString() in this._dict;
    }

    get(key : K)
    {
        return this.contains(key) ? this._dict[key.toString()].value : null;
    }

    allKeys() : Array<K>
    {
        var ret = Array<K>();
        for (var hash in this._dict)
        {
            ret.push(this._dict[hash].key);
        }
        return ret;
    }
}
export=Dictionary;

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
    public set(key: K, value: V): V
    {
        var wrapper = this.findWrapper(key);
        if (wrapper !== null && wrapper !== undefined)
        {
            var ret = wrapper.value;
            wrapper.value = value;
            return ret;
        }
        this.getOrCreateBin(key).push(new Wrapper<K, V>(key, value));
        return null;
    }

    public unset(key: K): V
    {
        if (this.contains(key))
        {
            var bin = this.getOrCreateBin(key);
            for (var i = 0; i < bin.length; ++i)
            {
                if (bin[i].key === key)
                {
                    var ret = bin[i].value;
                    bin.splice(i, i + 1);
                    return ret;
                }
            }
        }
        return null;
    }

    public contains(key: K): boolean
    {
        return this.findWrapper(key) !== null;
    }

    private getOrCreateBin(key: K): Wrapper<K, V>[]
    {
        var keyString = key.toString();
        if (!(keyString in this._dict))
        {
            this._dict[keyString] = new Array<Wrapper<K, V>>();
        }
        return this._dict[keyString];
    }

    private findWrapper(key: K): Wrapper<K, V>
    {
        if (key.toString() in this._dict)
        {
            var bin = this._dict[key.toString()];
            for (var i = 0; i < bin.length; ++i)
            {
                if (bin[i].key === key)
                {
                    return bin[i];
                }
            }
        }
        return null;
    }

    public get(key: K): V
    {
        var wrapper = this.findWrapper(key);
        if (wrapper !== null && wrapper !== undefined)
        {
            return wrapper.value;
        }
        return null;
    }

    /**
     * Gets the value associated with the key if it exists. Otherwise,
     * set the key to dictionary with default value, and return the
     * default value.
     * @param key
     * @param defaultValue
     */
    public getOrCreate(key: K, defaultValue: V): V
    {
        if (this.contains(key))
        {
            return this.get(key);
        }
        this.set(key, defaultValue);
        return defaultValue;
    }

    public allKeys(): Array<K>
    {
        var ret = Array<K>();
        for (var hash in this._dict)
        {
            var bin = this._dict[hash];
            for (var i = 0; i < bin.length; ++i)
            {
                ret.push(bin[i].key);
            }
        }
        return ret;
    }

    /**
     * Assumes that key.toString() is unique.
     */
    public primitiveObject(): Object
    {
        var allKeys = this.allKeys();
        var ret = {};
        for (var i = 0; i < allKeys.length; ++i)
        {
            var key = allKeys[i];
            ret[key.toString()] = this.get(key);
        }
        return ret;
    }
}
export = Dictionary;

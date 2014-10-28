import Equatable = require('../Core/Equatable');
import Dictionary = require('./Dictionary');

class Set<T> implements Equatable
{
    private _dict = new Dictionary<T, Boolean>();
    private _size = 0;
    size() : number
    {
        return this._size;
    }

    constructor();
    constructor(initialItems : Array<T>);
    constructor(initialItems? : Array<T>)
    {
        if (initialItems)
        {
            for (var i = 0; i < initialItems.length; i++)
            {
                this.add(initialItems[i]);
            }
        }
    }
    add(a : T)
    {
        if (this.contains(a))
        {
            return;
        }
        this._size++;
        this._dict.set(a, true);
    }
    contains(a : T) : boolean
    {
        return this._dict.get(a) === true;
    }
    remove(a : T)
    {
        if (!this.contains(a))
        {
            return;
        }
        this._size--;
        return this._dict.unset(a);
    }
    toArray() : Array<T>
    {
        return this._dict.allKeys();
    }
    containsSet(other : Set<T>)
    {
        var otherItems = other.toArray();
        for (var i = 0; i < otherItems.length; i++)
        {
            if (!this.contains(otherItems[i]))
            {
                return false;
            }
        }
        return true;
    }
    equals(other : Set<T>)
    {
        return this.containsSet(other) && other.containsSet(this);
    }
}
export=Set;

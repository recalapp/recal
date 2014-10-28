import InvalidActionException = require('../Core/InvalidActionException');

class Queue<T>
{
    private _array: T[] = new Array<T>();
    
    public get count(): number { return this._array.length; }
    public get empty(): boolean { return this.count === 0; }

    public enqueue(val: T): void
    {
        this._array.push(val);
    }

    public dequeue(): T
    {
        if (this.empty)
        {
            throw new InvalidActionException('Cannot dequeue an empty queue');
        }
        return this._array.shift();
    }

    public peek(): T
    {
        if (this.empty)
        {
            throw new InvalidActionException('Cannot peek at an empty queue');
        }
        return this._array[0];
    }
}

export = Queue;

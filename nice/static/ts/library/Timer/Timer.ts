import InvalidArgumentException = require('../Core/InvalidArgumentException');

class Timer
{
    constructor(action: ()=>void, interval: number)
    {
        if (interval < 0)
        {
            throw new InvalidArgumentException("Intervals must be nonnegative");
        }
        setTimeout(action, interval);
    }
}
export = Timer;
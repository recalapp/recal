import Exception = require('./Exception');

class UninitializedException extends Exception
{
    constructor(message: string)
    {
        super(message);
        this.name = 'Uninitialized Exception';
    }
}

export = UninitializedException;

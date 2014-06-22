import Exception = require('./Exception');

class InvalidActionException extends Exception
{
    constructor(message: string)
    {
        super(message);
        this.name = 'Invalid Action Exception';
    }
}

export = InvalidActionException;

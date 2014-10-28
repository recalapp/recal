import Exception = require('./Exception');

class InvalidArgumentException extends Exception
{
    constructor(message: string)
    {
        super(message);
        this.name = 'Invalid Argument Exception';
    }
}

export = InvalidArgumentException;

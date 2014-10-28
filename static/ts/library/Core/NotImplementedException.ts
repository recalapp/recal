import Exception = require('./Exception');

class NotImplementedException extends Exception
{
    constructor(message: string)
    {
        super(message);
        this.name = 'Not Implemented Exception';
    }
}

export = NotImplementedException;

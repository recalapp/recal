import Exception = require('./Exception');

class AssertionException extends Exception
{
    constructor(message: string)
    {
        super(message);
        this.name = 'Assertion Exception';
    }
}

export = AssertionException;
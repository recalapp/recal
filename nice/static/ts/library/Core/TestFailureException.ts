import Exception = require('./Exception');

class TestFailureException extends Exception
{
    constructor(message: string)
    {
        super(message);
        this.name = 'Test Failure Exception';
    }
}

export = TestFailureException;


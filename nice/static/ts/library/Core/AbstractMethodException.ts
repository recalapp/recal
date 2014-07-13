import Exception = require('./Exception');

class AbstractMethodException extends Exception
{
    constructor(message?: string)
    {
        super(message);
        this.name = 'Abstract Method Exception';
        if (this.message === undefined || this.message === null || this.message === '')
        {
            this.message = 'Method is abstract and must be overriden';
        }
    }
}

export = AbstractMethodException;

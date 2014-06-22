import InvalidActionException = require('../Core/InvalidActionException');
import TestFailureException = require('../Core/TestFailureException');
class Tester
{
    private _prefix : String = null;
    constructor(prefixMessage : String)
    {
        this._prefix = prefixMessage;
    }
    run() 
    {
        
    }
    tryInvalidCommand(command : () => void) : Boolean
    {
        try
        {
            command();
        }
        catch(err)
        {
            if (err instanceof InvalidActionException)
            {
                return true;
            }
        }
        return false;
    }
    assert(condition : Boolean, message : String)
    {
        if (!condition)
        {
            this.fails(message);
        }
    }
    fails(message : String)
    {
        throw new TestFailureException('FAILURE: ' + this._prefix + ' - ' + message);
    }
}
export = Tester;

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
    fails(message : String)
    {
        throw new TestFailureException('FAILURE: ' + this._prefix + ' - ' + message);
    }
}
export = Tester;

import UninitializedException = require ("./UninitializedException");
class Singleton
{
    private static _initialized = false;
    static _instance : Singleton;
    public static initialize() : void { this._initialized = true; }
    public static instance() : Singleton
    {
        if (!this._initialized)
        {
            throw new UninitializedException("Singleton has not been initialized.");
        }
        return this._instance;
    }
}

export = Singleton;

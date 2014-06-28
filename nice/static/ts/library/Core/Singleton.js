define(["require", "exports", "./UninitializedException"], function(require, exports, UninitializedException) {
    var Singleton = (function () {
        function Singleton() {
        }
        Singleton.initialize = function () {
            this._initialized = true;
        };
        Singleton.instance = function () {
            if (!this._initialized) {
                throw new UninitializedException("Singleton has not been initialized.");
            }
            return this._instance;
        };
        Singleton._initialized = false;
        return Singleton;
    })();

    
    return Singleton;
});

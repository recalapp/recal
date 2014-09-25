define(["require", "exports"], function(require, exports) {
    /*
    interface Error {
    name: string;
    message: string;
    }
    */
    var Exception = (function () {
        function Exception(message) {
            this.name = 'Exception';
            this.message = message;
        }
        Exception.prototype.toString = function () {
            return this.name + ': ' + this.message;
        };
        return Exception;
    })();

    
    return Exception;
});

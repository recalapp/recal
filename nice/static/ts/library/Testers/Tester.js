define(["require", "exports", '../Core/TestFailureException'], function(require, exports, TestFailureException) {
    var Tester = (function () {
        function Tester(prefixMessage) {
            this._prefix = null;
            this._prefix = prefixMessage;
        }
        Tester.prototype.run = function () {
        };
        Tester.prototype.fails = function (message) {
            throw new TestFailureException('FAILURE: ' + this._prefix + ' - ' + message);
        };
        return Tester;
    })();
    
    return Tester;
});

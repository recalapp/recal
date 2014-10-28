define(["require", "exports", '../Core/InvalidActionException', '../Core/TestFailureException'], function(require, exports, InvalidActionException, TestFailureException) {
    var Tester = (function () {
        function Tester(prefixMessage) {
            this._prefix = null;
            this._prefix = prefixMessage;
        }
        Tester.prototype.run = function () {
        };
        Tester.prototype.tryInvalidCommand = function (command) {
            try  {
                command();
            } catch (err) {
                if (err instanceof InvalidActionException) {
                    return true;
                }
            }
            return false;
        };
        Tester.prototype.assert = function (condition, message) {
            if (!condition) {
                this.fails(message);
            }
        };
        Tester.prototype.fails = function (message) {
            throw new TestFailureException('FAILURE: ' + this._prefix + ' - ' + message);
        };
        return Tester;
    })();
    
    return Tester;
});

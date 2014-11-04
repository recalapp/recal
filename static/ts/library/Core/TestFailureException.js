var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Exception'], function(require, exports, Exception) {
    var TestFailureException = (function (_super) {
        __extends(TestFailureException, _super);
        function TestFailureException(message) {
            _super.call(this, message);
            this.name = 'Test Failure Exception';
        }
        return TestFailureException;
    })(Exception);

    
    return TestFailureException;
});

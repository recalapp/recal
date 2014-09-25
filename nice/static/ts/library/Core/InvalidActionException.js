var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Exception'], function(require, exports, Exception) {
    var InvalidActionException = (function (_super) {
        __extends(InvalidActionException, _super);
        function InvalidActionException(message) {
            _super.call(this, message);
            this.name = 'Invalid Action Exception';
        }
        return InvalidActionException;
    })(Exception);

    
    return InvalidActionException;
});

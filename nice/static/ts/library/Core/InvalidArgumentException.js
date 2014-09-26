var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Exception'], function(require, exports, Exception) {
    var InvalidArgumentException = (function (_super) {
        __extends(InvalidArgumentException, _super);
        function InvalidArgumentException(message) {
            _super.call(this, message);
            this.name = 'Invalid Argument Exception';
        }
        return InvalidArgumentException;
    })(Exception);

    
    return InvalidArgumentException;
});
//# sourceMappingURL=InvalidArgumentException.js.map

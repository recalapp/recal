var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Exception'], function(require, exports, Exception) {
    var NotImplementedException = (function (_super) {
        __extends(NotImplementedException, _super);
        function NotImplementedException(message) {
            _super.call(this, message);
            this.name = 'Not Implemented Exception';
        }
        return NotImplementedException;
    })(Exception);

    
    return NotImplementedException;
});

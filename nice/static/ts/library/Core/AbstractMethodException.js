var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Exception'], function(require, exports, Exception) {
    var AbstractMethodException = (function (_super) {
        __extends(AbstractMethodException, _super);
        function AbstractMethodException(message) {
            _super.call(this, message);
            this.name = 'Abstract Method Exception';
            if (this.message === undefined || this.message === null || this.message === '') {
                this.message = 'Method is abstract and must be overriden';
            }
        }
        return AbstractMethodException;
    })(Exception);

    
    return AbstractMethodException;
});

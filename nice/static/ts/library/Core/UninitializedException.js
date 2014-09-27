var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
        this.constructor = d;
    }

    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Exception'], function (require, exports, Exception) {
    var UninitializedException = (function (_super) {
        __extends(UninitializedException, _super);
        function UninitializedException(message) {
            _super.call(this, message);
            this.name = 'Uninitialized Exception';
        }

        return UninitializedException;
    })(Exception);


    return UninitializedException;
});

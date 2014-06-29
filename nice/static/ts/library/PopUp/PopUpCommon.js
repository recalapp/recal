define(["require", "exports"], function(require, exports) {
    exports.CssSelector = '.popup';
    (function (PopUpType) {
        PopUpType[PopUpType["main"] = 0] = "main";
        PopUpType[PopUpType["detached"] = 1] = "detached";
    })(exports.PopUpType || (exports.PopUpType = {}));
    var PopUpType = exports.PopUpType;
    ;
});

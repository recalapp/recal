define(["require", "exports"], function(require, exports) {
    exports.CssSelector = '.popup';
    exports.FocusClass = 'panel-primary';
    exports.BlurClass = 'panel-default';
    exports.PanelCssSelector = '.panel';
    (function (PopUpType) {
        PopUpType[PopUpType["main"] = 0] = "main";
        PopUpType[PopUpType["detached"] = 1] = "detached";
    })(exports.PopUpType || (exports.PopUpType = {}));
    var PopUpType = exports.PopUpType;
    ;
});

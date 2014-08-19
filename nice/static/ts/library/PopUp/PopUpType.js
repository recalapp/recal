define(["require", "exports"], function(require, exports) {
    var PopUpType;
    (function (PopUpType) {
        PopUpType[PopUpType["detached"] = 0] = "detached";
        PopUpType[PopUpType["pinned"] = 1] = "pinned";
    })(PopUpType || (PopUpType = {}));

    
    return PopUpType;
});

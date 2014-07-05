define(["require", "exports"], function(require, exports) {
    var ClickToEditType;
    (function (ClickToEditType) {
        ClickToEditType[ClickToEditType["input"] = 0] = "input";
        ClickToEditType[ClickToEditType["select"] = 1] = "select";
        ClickToEditType[ClickToEditType["textArea"] = 2] = "textArea";
    })(ClickToEditType || (ClickToEditType = {}));
    
    return ClickToEditType;
});

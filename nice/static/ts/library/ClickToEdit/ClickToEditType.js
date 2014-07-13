define(["require", "exports"], function(require, exports) {
    var ClickToEditType;
    (function (ClickToEditType) {
        ClickToEditType[ClickToEditType["text"] = 0] = "text";
        ClickToEditType[ClickToEditType["textArea"] = 1] = "textArea";
        ClickToEditType[ClickToEditType["select"] = 2] = "select";
    })(ClickToEditType || (ClickToEditType = {}));
    
    return ClickToEditType;
});

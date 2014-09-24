define(["require", "exports"], function(require, exports) {
    var ComparableResult;
    (function (ComparableResult) {
        ComparableResult[ComparableResult["greater"] = 1] = "greater";
        ComparableResult[ComparableResult["equal"] = 0] = "equal";
        ComparableResult[ComparableResult["less"] = -1] = "less";
    })(ComparableResult || (ComparableResult = {}));

    
    return ComparableResult;
});
//# sourceMappingURL=ComparableResult.js.map

define(["require", "exports"], function(require, exports) {
    var IndicatorsType;
    (function (IndicatorsType) {
        IndicatorsType[IndicatorsType["persistent"] = 0] = "persistent";
        IndicatorsType[IndicatorsType["temporary"] = 1] = "temporary";
        IndicatorsType[IndicatorsType["error"] = 2] = "error";
    })(IndicatorsType || (IndicatorsType = {}));
    
    return IndicatorsType;
});

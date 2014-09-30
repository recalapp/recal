define(["require", "exports"], function(require, exports) {
    var SectionTypesModel = (function () {
        function SectionTypesModel(copy) {
            this._code = null;
            this._displayText = null;
            this.code = copy.code;
            this.displayText = copy.displayText;
        }
        Object.defineProperty(SectionTypesModel.prototype, "code", {
            get: function () {
                return this._code;
            },
            set: function (value) {
                this._code = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(SectionTypesModel.prototype, "displayText", {
            get: function () {
                return this._displayText;
            },
            set: function (value) {
                this._displayText = value;
            },
            enumerable: true,
            configurable: true
        });

        return SectionTypesModel;
    })();
    
    return SectionTypesModel;
});
//# sourceMappingURL=SectionTypesModel.js.map

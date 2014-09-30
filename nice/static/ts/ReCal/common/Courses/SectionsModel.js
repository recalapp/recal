define(["require", "exports", './SectionTypesModel'], function(require, exports, SectionTypesModel) {
    var SectionsModel = (function () {
        function SectionsModel(copy) {
            this._coursesModel = null;
            this._sectionId = null;
            this._title = null;
            this._sectionTypesModel = null;
            if (!copy) {
                return;
            }
            this.coursesModel = copy.coursesModel; // don't copy because courses own sections, not the other way around.
            this.sectionId = copy.sectionId;
            this.title = copy.title;
            this.sectionTypesModel = new SectionTypesModel(copy.sectionTypesModel);
        }
        Object.defineProperty(SectionsModel.prototype, "coursesModel", {
            get: function () {
                return this._coursesModel;
            },
            set: function (value) {
                this._coursesModel = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(SectionsModel.prototype, "sectionId", {
            get: function () {
                return this._sectionId;
            },
            set: function (value) {
                this._sectionId = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(SectionsModel.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (value) {
                this._title = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(SectionsModel.prototype, "sectionTypesModel", {
            get: function () {
                return this._sectionTypesModel;
            },
            set: function (value) {
                this._sectionTypesModel = value;
            },
            enumerable: true,
            configurable: true
        });

        return SectionsModel;
    })();
    
    return SectionsModel;
});
//# sourceMappingURL=SectionsModel.js.map

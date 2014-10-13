define(["require", "exports", '../../../library/Core/InvalidArgumentException', './SectionsModel', '../../../library/DataStructures/Set'], function(require, exports, InvalidArgumentException, SectionsModel, Set) {
    var CoursesModel = (function () {
        function CoursesModel(copy) {
            var _this = this;
            this._courseId = null;
            this._title = null;
            this._description = null;
            this._courseListings = new Set();
            this._primaryListing = null;
            this._sectionsModels = new Set();
            if (!copy) {
                return;
            }
            this.courseId = copy.courseId;
            this.title = copy.title;
            this.description = copy.description;
            copy.courseListings.map(function (courseListing) {
                _this._courseListings.add(courseListing);
            });
            this.primaryListing = copy.primaryListing;
            copy.sectionsModels.map(function (sectionsModel) {
                var newModel = new SectionsModel(sectionsModel);
                newModel.coursesModel = _this;
                _this._sectionsModels.add(newModel);
            });
        }
        Object.defineProperty(CoursesModel.prototype, "courseId", {
            get: function () {
                return this._courseId;
            },
            set: function (value) {
                this._courseId = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(CoursesModel.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (value) {
                this._title = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(CoursesModel.prototype, "description", {
            get: function () {
                return this._description;
            },
            set: function (value) {
                this._description = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(CoursesModel.prototype, "courseListings", {
            get: function () {
                return this._courseListings.toArray();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CoursesModel.prototype, "primaryListing", {
            get: function () {
                return this._primaryListing;
            },
            set: function (value) {
                if (!this._courseListings.contains(value)) {
                    throw new InvalidArgumentException("Primary listing must also be in course listings");
                }
                this._primaryListing = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(CoursesModel.prototype, "sectionsModels", {
            get: function () {
                return this._sectionsModels.toArray();
            },
            enumerable: true,
            configurable: true
        });
        return CoursesModel;
    })();

    
    return CoursesModel;
});
//# sourceMappingURL=CoursesModel.js.map

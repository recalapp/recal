define(["require", "exports"], function(require, exports) {
    var ColorManager = (function () {
        function ColorManager(colorResource, availableColors, enrollments) {
            this.colorResource = colorResource;
            this.initUsableColors(availableColors, enrollments);
        }
        Object.defineProperty(ColorManager.prototype, "availableColors", {
            get: function () {
                return this._usableColors;
            },
            enumerable: true,
            configurable: true
        });

        ColorManager.prototype.initUsableColors = function (availableColors, enrollments) {
            var _this = this;
            if (availableColors && enrollments) {
                this._usableColors = availableColors;
                this._initColorToNumberOfCourses(enrollments);
            } else {
                this._usableColors = this.colorResource.query({});
                this._usableColors.$promise.then(function (colors) {
                    _this._initColorToNumberOfCourses();
                });
            }
        };

        ColorManager.prototype._initColorToNumberOfCourses = function (enrollments) {
            this.colorToNumberOfCourses = new Array(this._usableColors.length);
            for (var i = 0; i < this.colorToNumberOfCourses.length; i++) {
                this.colorToNumberOfCourses[i] = 0;
            }

            if (enrollments) {
                for (var i = 0; i < this._usableColors.length; i++) {
                    for (var j = 0; j < enrollments.length; j++) {
                        if (this._usableColors[i].id == enrollments[j].color.id) {
                            this.colorToNumberOfCourses[i]++;
                            break;
                        }
                    }
                }
            }
        };

        ColorManager.prototype.addColor = function (color) {
            for (var i = 0; i < this._usableColors.length; i++) {
                if (color.id == this._usableColors[i].id) {
                    this.colorToNumberOfCourses[i]--;
                    return;
                }
            }
        };

        ColorManager.prototype.getPreviewColor = function () {
            return ColorManager.previewColor;
        };

        ColorManager.prototype.nextColor = function () {
            var currMin = Number.MAX_VALUE;
            var possibleColorIndices = [];
            for (var i = 0; i < this._usableColors.length; i++) {
                if (this.colorToNumberOfCourses[i] < currMin) {
                    currMin = this.colorToNumberOfCourses[i];
                    possibleColorIndices = [i];
                } else if (this.colorToNumberOfCourses[i] == currMin) {
                    possibleColorIndices.push(i);
                }
            }

            var idx = Math.floor(Math.random() * possibleColorIndices.length);
            this.colorToNumberOfCourses[possibleColorIndices[idx]]++;
            return this._usableColors[possibleColorIndices[idx]];
        };
        ColorManager.previewColor = {
            id: -1,
            dark: 'rgb(84, 84, 84)',
            light: 'rgb(210, 210, 210)'
        };
        return ColorManager;
    })();

    
    return ColorManager;
});
//# sourceMappingURL=ColorManager.js.map

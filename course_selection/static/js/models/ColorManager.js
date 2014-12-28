define(["require", "exports"], function(require, exports) {
    var ColorManager = (function () {
        function ColorManager(colorResource) {
            this.colorResource = colorResource;
            this.courseColorMap = {};
            this.initUsableColors();
            this.initCourseColorMap();
        }
        ColorManager.prototype.initCourseColorMap = function () {
        };

        ColorManager.prototype.initUsableColors = function () {
            var _this = this;
            this.colorResource.get({}, function (data) {
                _this.onLoaded(data);
            });
        };

        ColorManager.prototype.onLoaded = function (data) {
            this.usableColors = data['objects'].map(function (color) {
                return {
                    id: color.id,
                    dark: '#' + color.dark,
                    light: '#' + color.light
                };
            });

            this.colorToNumberOfCourses = new Array(this.usableColors.length);
            for (var i = 0; i < this.colorToNumberOfCourses.length; i++) {
                this.colorToNumberOfCourses[i] = 0;
            }
        };

        ColorManager.prototype.addColor = function (color) {
            for (var i = 0; i < this.usableColors.length; i++) {
                if (color.id == this.usableColors[i].id) {
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
            for (var i = 0; i < this.usableColors.length; i++) {
                if (this.colorToNumberOfCourses[i] < currMin) {
                    currMin = this.colorToNumberOfCourses[i];
                    possibleColorIndices = [i];
                } else if (this.colorToNumberOfCourses[i] == currMin) {
                    possibleColorIndices.push(i);
                }
            }

            var idx = Math.floor(Math.random() * possibleColorIndices.length);
            this.colorToNumberOfCourses[possibleColorIndices[idx]]++;
            return this.usableColors[possibleColorIndices[idx]];
        };
        ColorManager.$inject = ['$resource'];
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

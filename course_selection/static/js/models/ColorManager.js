define(["require", "exports"], function(require, exports) {
    var ColorManager = (function () {
        function ColorManager(colorResource, availableColors, enrollments) {
            this.colorResource = colorResource;
            this.availableColors = availableColors;
            this.enrollments = enrollments;
            this.initUsableColors(availableColors, enrollments);
        }
        ColorManager.prototype.initUsableColors = function (availableColors, enrollments) {
            var _this = this;
            if (availableColors && enrollments) {
                this.usableColors = availableColors;
                this._initColorToNumberOfCourses(enrollments);
            } else {
                this.colorResource.get({}).$promise.then(function (data) {
                    _this.onLoaded(data);
                });
            }
        };

        ColorManager.prototype.onLoaded = function (data) {
            this.usableColors = data['objects'].map(function (color) {
                return {
                    id: color.id,
                    dark: '#' + color.dark,
                    light: '#' + color.light
                };
            });

            this._initColorToNumberOfCourses();
        };

        // say enrollments = [a, b, c], where a, b, c are course enrollments containing
        // a colors property.
        ColorManager.prototype._initColorToNumberOfCourses = function (enrollments) {
            this.colorToNumberOfCourses = new Array(this.usableColors.length);
            for (var i = 0; i < this.colorToNumberOfCourses.length; i++) {
                this.colorToNumberOfCourses[i] = 0;
            }

            if (enrollments) {
                for (var i = 0; i < this.usableColors.length; i++) {
                    for (var j = 0; j < enrollments.length; j++) {
                        if (this.usableColors[i].id == enrollments[j].color.id) {
                            this.colorToNumberOfCourses[i]++;
                            break;
                        }
                    }
                }
            }
        };

        // someone is done using this color. lower count for color
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

        // TODO: what if initUsableColors takes too long
        // returns a color of minimum usage in the calendar in 2 passes
        // e.g., if 2 colors out of 10 colors have been used once,
        // this function returns one of the 8 colors not used yet.
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
        ColorManager.previewColor = {
            id: -1,
            dark: 'rgb(84, 84, 84)',
            light: 'rgb(210, 210, 210)'
        };
        return ColorManager;
    })();

    
    return ColorManager;
});

define(["require", "exports"], function(require, exports) {
    var ColorResource = (function () {
        function ColorResource($resource) {
            this.$resource = $resource;
            this.courseColorMap = {};
            this.initCourseColorMap();
            this.initUsableColors();
        }
        // get course color map for this user, this schedule
        ColorResource.prototype.initCourseColorMap = function () {
        };

        // usableColors = defaultColors - colors in courseColorMap
        // TODO: finish this
        ColorResource.prototype.initUsableColors = function () {
            this.usableColors = ColorResource.defaultColors.slice();
        };

        // return a random usable color in usableColors
        ColorResource.prototype.nextColor = function () {
            if (this.usableColors.length == 0) {
                this.initUsableColors();
            }

            var idx = Math.floor(Math.random() * this.usableColors.length);
            var color = this.usableColors.splice(idx, 1);
            return color;
        };
        ColorResource.$inject = ['$resource'];

        ColorResource.defaultColors = [
            {
                selected: "#aaaaaa",
                unselected: "#bbbbbb",
                border: "#a1a1a1"
            }
        ];
        return ColorResource;
    })();

    
    return ColorResource;
});

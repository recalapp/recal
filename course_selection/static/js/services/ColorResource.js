define(["require", "exports"], function(require, exports) {
    var ColorResource = (function () {
        function ColorResource($resource) {
            this.$resource = $resource;
            this.courseColorMap = {};
            this.initCourseColorMap();
            this.initUsableColors();
        }
        ColorResource.prototype.initCourseColorMap = function () {
        };

        ColorResource.prototype.initUsableColors = function () {
        };

        ColorResource.prototype.nextColor = function () {
        };
        ColorResource.$inject = ['$resource'];

        ColorResource.defaultColors = [
            {
                selected: "aaaaaa",
                unselected: "bbbbbb",
                border: "a1a1a1"
            }
        ];
        return ColorResource;
    })();

    
    return ColorResource;
});
//# sourceMappingURL=ColorResource.js.map

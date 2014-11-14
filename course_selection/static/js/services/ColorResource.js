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

        ColorResource.prototype.toRgba = function (rgb) {
            return rgb.substring(0, 3) + "a" + rgb.substring(3, rgb.length - 1) + ", " + ColorResource.ALPHA + rgb.substring(rgb.length - 1, rgb.length);
        };

        ColorResource.prototype.toPreviewColor = function (color) {
            return this.toRgba(color);
        };

        ColorResource.prototype.addColor = function (color) {
            this.usableColors.push(color);
        };

        ColorResource.prototype.getPreviewColor = function () {
            return ColorResource.previewColor;
        };

        // return a random usable color in usableColors
        ColorResource.prototype.nextColor = function () {
            if (this.usableColors.length == 0) {
                this.initUsableColors();
            }

            var idx = Math.floor(Math.random() * this.usableColors.length);
            var color = this.usableColors.splice(idx, 1)[0];
            return color;
        };
        ColorResource.$inject = ['$resource'];

        ColorResource.ALPHA = 0.6;

        ColorResource.previewColor = {
            dark: 'rgb(84, 84, 84)',
            light: 'rgb(210, 210, 210)'
        };

        ColorResource.defaultColors = [
            {
                dark: "rgb(45, 98, 52)",
                light: "rgb(208, 222, 207)"
            },
            {
                dark: "rgb(56, 92, 146)",
                light: "rgb(213, 220, 236)"
            },
            {
                dark: "rgb(149, 73, 98)",
                light: "rgb(235, 210, 219)"
            },
            {
                dark: "rgb(177, 127, 0)",
                light: "rgb(250, 244, 203)"
            },
            {
                dark: "rgb(137, 94, 46)",
                light: "rgb(231, 220, 206)"
            },
            {
                dark: "rgb(47, 119, 112)",
                light: "rgb(209, 231, 228)"
            },
            {
                dark: "rgb(97, 73, 150)",
                light: "rgb(220, 213, 226)"
            }
        ];
        return ColorResource;
    })();

    
    return ColorResource;
});

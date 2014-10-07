define(["require", "exports", './Color'], function(require, exports, Color) {
    var ColorUtilities = (function () {
        function ColorUtilities() {
        }
        /**
        * Returns a new color object equaling the old color with the luminance
        * adjusted.
        * @param color
        * @param luminance
        * @returns {Color}
        */
        ColorUtilities.colorWithLuminance = function (color, luminance) {
            var adjustLuminance = function (value) {
                return Math.round(Math.min(Math.max(0, value + (value * luminance)), 255));
            };
            var newColor = Color.fromRGB(adjustLuminance(color.red), adjustLuminance(color.blue), adjustLuminance(color.green));
            return color;
        };
        return ColorUtilities;
    })();

    
    return ColorUtilities;
});
//# sourceMappingURL=ColorUtilities.js.map

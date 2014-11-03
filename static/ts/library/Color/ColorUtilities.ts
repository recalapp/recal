import Color = require('./Color');

class ColorUtilities
{
    /**
     * Returns a new color object equaling the old color with the luminance
     * adjusted.
     * @param color
     * @param luminance
     * @returns {Color}
     */
    public static colorWithLuminance(color: Color, luminance: number): Color
    {
        var adjustLuminance = (value: number)=>
        {
            return Math.round(Math.min(Math.max(0, value + (value * luminance)),
                255));
        };
        var newColor = Color.fromRGB(
            adjustLuminance(color.red),
            adjustLuminance(color.blue),
            adjustLuminance(color.green)
        );
        return color;
    }
}

export = ColorUtilities;
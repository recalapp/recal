import IColorPalette = require('../interfaces/IColorPalette');

class ColorResource {
    public static $inject = ['$resource'];

    private static ALPHA: number = 0.6;

    private static previewColor: IColorPalette = {
        dark: 'rgb(84, 84, 84)',
        light: 'rgb(210, 210, 210)'
    };

    private static defaultColors: IColorPalette[] = [
        {   // green
            dark: "rgb(45, 98, 52)",
            light: "rgb(208, 222, 207)",
        },
        { // blue
            dark: "rgb(56, 92, 146)",
            light: "rgb(213, 220, 236)",
        },
        { // red
            dark: "rgb(149, 73, 98)",
            light: "rgb(235, 210, 219)",
        },
        { // brown
            dark: "rgb(137, 94, 46)",
            light: "rgb(231, 220, 206)",
        },
        { // cyan
            dark: "rgb(47, 119, 112)",
            light: "rgb(209, 231, 228)",
        }
    ];

    private courseColorMap = {};
    private usableColors: IColorPalette[];

    constructor(private $resource) {
        this.initCourseColorMap();
        this.initUsableColors();
    }

    // get course color map for this user, this schedule
    private initCourseColorMap() {
    }

    // usableColors = defaultColors - colors in courseColorMap
    // TODO: finish this
    private initUsableColors() {
        this.usableColors = ColorResource.defaultColors.slice();
    }

    private toRgba(rgb: string): string {
        return rgb.substring(0, 3) 
            + "a" 
            + rgb.substring(3, rgb.length - 1) 
            + ", "
            + ColorResource.ALPHA 
            + rgb.substring(rgb.length - 1, rgb.length);
    }

    public toPreviewColor(color: string): string {
        return this.toRgba(color);
    }

    public addColor(color: IColorPalette) {
        this.usableColors.push(color);
    }

    public getPreviewColor(): IColorPalette {
        return ColorResource.previewColor;
    }

    // return a random usable color in usableColors
    public nextColor() {
        if (this.usableColors.length == 0) {
            this.initUsableColors();
        }

        var idx: number = Math.floor(Math.random() * this.usableColors.length);
        var color = this.usableColors.splice(idx, 1)[0];
        return color;
    }
}

export = ColorResource;

import IColorPalette = require('../interfaces/IColorPalette');

class ColorManager {
    public static $inject = ['$resource'];

    private static ALPHA: number = 0.8;

    private static previewColor: IColorPalette = {
        dark: 'rgb(84, 84, 84)',
        light: 'rgb(210, 210, 210)'
    };

    private courseColorMap = {};
    private usableColors: IColorPalette[];

    constructor(private colorResource) {
        this.initUsableColors();
        this.initCourseColorMap();
    }

    // get course color map for this user, this schedule
    private initCourseColorMap() {
    }

    // TODO: finish this
    private initUsableColors() {
        this.colorResource.get({}, (data) => {
            this.onLoaded(data);
        });
    }

    private onLoaded(data) {
        this.usableColors = data['objects'].map((color) => {
            return {
                dark: '#' + color.dark,
                light: '#' + color.light
            }
        });
    }

    public addColor(color: IColorPalette) {
        this.usableColors.push(color);
    }

    public getPreviewColor(): IColorPalette {
        return ColorManager.previewColor;
    }

    // return a random usable color in usableColors
    public nextColor(): IColorPalette {
        if (this.usableColors.length == 0) {
            this.initUsableColors();
        }

        var idx: number = Math.floor(Math.random() * this.usableColors.length);
        var color = this.usableColors.splice(idx, 1)[0];
        return color;
    }
}

export = ColorManager;

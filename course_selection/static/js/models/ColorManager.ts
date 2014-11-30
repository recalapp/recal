import IColorPalette = require('../interfaces/IColorPalette');

class ColorManager {
    public static $inject = ['$resource'];
    private static previewColor: IColorPalette = {
        id: -1,
        dark: 'rgb(84, 84, 84)',
        light: 'rgb(210, 210, 210)'
    };

    private courseColorMap = {};
    private usableColors: IColorPalette[];
    private colorToNumberOfCourses: number[];

    constructor(private colorResource) {
        this.initUsableColors();
        this.initCourseColorMap();
    }

    // get course color map for this user, this schedule
    private initCourseColorMap() {
    }

    private initUsableColors() {
        this.colorResource.get({}, (data) => {
            this.onLoaded(data);
        });
    }

    private onLoaded(data) {
        this.usableColors = data['objects'].map((color) => {
            return {
                id: color.id,
                dark: '#' + color.dark,
                light: '#' + color.light
            }
        });

        this.colorToNumberOfCourses = new Array(this.usableColors.length);
        for (var i = 0; i < this.colorToNumberOfCourses.length; i++) {
            this.colorToNumberOfCourses[i] = 0;
        }
    }

    // someone is done using this color. lower count for color
    public addColor(color: IColorPalette) {
        for (var i = 0; i < this.usableColors.length; i++) {
            if (color.id == this.usableColors[i].id) {
                this.colorToNumberOfCourses[i]--;
                return;
            }
        }
    }

    public getPreviewColor(): IColorPalette {
        return ColorManager.previewColor;
    }

    // TODO: what if initUsableColors takes too long
    // returns a color of minimum usage in the calendar in 2 passes
    // e.g., if 2 colors out of 10 colors have been used once,
    // this function returns one of the 8 colors not used yet.
    public nextColor(): IColorPalette {
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

        var idx: number = Math.floor(Math.random() * possibleColorIndices.length);
        this.colorToNumberOfCourses[possibleColorIndices[idx]]++;
        return this.usableColors[possibleColorIndices[idx]];
    }
}

export = ColorManager;

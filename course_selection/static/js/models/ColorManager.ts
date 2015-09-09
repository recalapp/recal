import IColorPalette = require('../interfaces/IColorPalette');
import IEnrollment = require('../interfaces/IEnrollment');

class ColorManager {
    public static previewColor: IColorPalette = {
        id: -1,
        dark: 'rgb(84, 84, 84)',
        light: 'rgb(210, 210, 210)'
    };

    private _usableColors;
    public get availableColors() {
        return this._usableColors;
    }

    private colorToNumberOfCourses: number[];

    constructor(
            private colorResource,
            availableColors?: Array<IColorPalette>,
            enrollments?: Array<IEnrollment>
            ) {
        this.initUsableColors(availableColors, enrollments);
    }

    private initUsableColors(
            availableColors?: Array<IColorPalette>,
            enrollments?: Array<IEnrollment>) {
        if (availableColors && enrollments) {
            this._usableColors = availableColors;
            this._initColorToNumberOfCourses(enrollments);
        }
        else {
            this._usableColors = this.colorResource.query({});
            this._usableColors.$promise.then((colors) => {
                this._initColorToNumberOfCourses();
            });
        }
    }

    // we keep track of how many courses are using a color palette
    // to initialize this mapping, we load the enrollments from previous sessions
    private _initColorToNumberOfCourses(enrollments?: Array<IEnrollment>) {
        this.colorToNumberOfCourses = new Array(this._usableColors.length);
        for (var i = 0; i < this.colorToNumberOfCourses.length; i++) {
            this.colorToNumberOfCourses[i] = 0;
        }

        if (enrollments) {
            for (var i = 0; i < this._usableColors.length; i++) {
                for (var j = 0; j < enrollments.length; j++) {
                    if (this._usableColors[i].id == enrollments[j].color.id) {
                        this.colorToNumberOfCourses[i]++;
                        break;
                    }
                }
            }
        }
    }

    // someone is done using this color. lower count for color
    public addColor(color: IColorPalette) {
        for (var i = 0; i < this._usableColors.length; i++) {
            if (color.id == this._usableColors[i].id) {
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
        for (var i = 0; i < this._usableColors.length; i++) {
            if (this.colorToNumberOfCourses[i] < currMin) {
                currMin = this.colorToNumberOfCourses[i];
                possibleColorIndices = [i];
            } else if (this.colorToNumberOfCourses[i] == currMin) {
                possibleColorIndices.push(i);
            }
        }

        var idx: number = Math.floor(Math.random() * possibleColorIndices.length);
        this.colorToNumberOfCourses[possibleColorIndices[idx]]++;
        return this._usableColors[possibleColorIndices[idx]];
    }
}

export = ColorManager;

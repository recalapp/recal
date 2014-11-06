import IColor = require('../interfaces/IColor');

class ColorResource {
    public static $inject = ['$resource'];

    private static defaultColors: IColor[] = [
        {   // green
            selected: "rgb(45, 98, 52)",
            unselected: "rgb(208, 222, 207)",
            border: "rgb(45, 98, 52)"
        },
        { // blue
            selected: "rgb(56, 92, 146)",
            unselected: "rgb(213, 220, 236)",
            border: "rgb(56, 92, 146)"
        },
        { // red
            selected: "rgb(149, 73, 98)",
            unselected: "rgb(235, 210, 219)",
            border: "rgb(149, 73, 98)"
        },
        { // brown
            selected: "rgb(137, 94, 46)",
            unselected: "rgb(231, 220, 206)",
            border: "rgb(137, 94, 46)",
        },
        { // cyan
            selected: "rgb(47, 119, 112)",
            unselected: "rgb(209, 231, 228)",
            border: "rgb(47, 119, 112)",
        }
    ];

    private courseColorMap = {};
    private usableColors: IColor[];

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

    public addColor(color: IColor) {
        this.usableColors.push(color);
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

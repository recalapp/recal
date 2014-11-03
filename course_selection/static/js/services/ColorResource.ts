import IColor = require('../interfaces/IColor');

class ColorResource {
    public static $inject = ['$resource'];

    private static defaultColors: IColor[] = [
    {
        selected: "aaaaaa",
        unselected: "bbbbbb",
        border: "a1a1a1"
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
    }

    // return a random usable color in usableColors
    public nextColor() {
    }
}

export = ColorResource;

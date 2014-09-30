import Courses = require('./Courses');

import ISectionTypesModel = Courses.ISectionTypesModel;

class SectionTypesModel implements ISectionTypesModel
{
    private _code: string = null;
    public get code(): string { return this._code; }

    public set code(value: string) { this._code = value; }

    private _displayText: string = null;
    public get displayText(): string { return this._displayText; }

    public set displayText(value: string) { this._displayText = value; }

    constructor(copy?: ISectionTypesModel)
    {
        if (!copy)
        {
            return;
        }
        this.code = copy.code;
        this.displayText = copy.displayText;
    }
}
export = SectionTypesModel;
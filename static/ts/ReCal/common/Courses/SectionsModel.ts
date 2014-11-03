import Color = require('../../../library/Color/Color');
import Courses = require('./Courses');
import SectionTypesModel = require('./SectionTypesModel');

import ICoursesModel = Courses.ICoursesModel;
import ISectionsModel = Courses.ISectionsModel;
import ISectionTypesModel = Courses.ISectionTypesModel;

class SectionsModel implements ISectionsModel
{
    private _coursesModel: ICoursesModel = null;
    public get coursesModel(): ICoursesModel { return this._coursesModel; }

    public set coursesModel(value: ICoursesModel)
    { this._coursesModel = value; }

    private _sectionId: string = null;
    public get sectionId(): string { return this._sectionId; }

    public set sectionId(value: string) { this._sectionId = value; }

    private _title: string = null;
    public get title(): string { return this._title; }

    public set title(value: string) { this._title = value; }

    private _color: Color = null;
    public get color(): Color { return this._color; }
    public set color(value: Color) { this._color = value; }

    private _sectionTypesModel: ISectionTypesModel = null;
    public get sectionTypesModel(): ISectionTypesModel
    { return this._sectionTypesModel; }

    public set sectionTypesModel(value: ISectionTypesModel)
    { this._sectionTypesModel = value; }

    constructor(copy?: ISectionsModel)
    {
        if (!copy)
        {
            return;
        }
        if (copy.coursesModel)
        {
            this.coursesModel = copy.coursesModel; // don't copy because courses own sections, not the other way around.
        }
        this.sectionId = copy.sectionId;
        this.title = copy.title;
        this.sectionTypesModel = new SectionTypesModel(copy.sectionTypesModel);
        this.color = copy.color;
    }
}
export = SectionsModel;
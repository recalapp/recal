import Courses = require('./Courses');
import InvalidArgumentException = require('../../../library/Core/InvalidArgumentException');
import SectionsModel = require('./SectionsModel');
import Set = require('../../../library/DataStructures/Set');

import ICoursesModel = Courses.ICoursesModel;
import ISectionsModel = Courses.ISectionsModel;

class CoursesModel implements ICoursesModel
{
    private _courseId: string = null;
    public get courseId(): string { return this._courseId; }

    public set courseId(value: string) { this._courseId = value; }

    private _title: string = null;
    public get title(): string { return this._title; }

    public set title(value: string) { this._title = value; }

    private _description: string = null;
    public get description(): string { return this._description; }

    public set description(value: string) { this._description = value; }

    private _courseListings: Set<string> = new Set<string>();
    public get courseListings(): string[] { return this._courseListings.toArray(); }

    private _primaryListing: string = null;
    public get primaryListing(): string { return this._primaryListing; }

    public set primaryListing(value: string)
    {
        if (!this._courseListings.contains(value))
        {
            throw new InvalidArgumentException("Primary listing must also be in course listings");
        }
        this._primaryListing = value;
    }

    private _sectionsModels: Set<ISectionsModel> = new Set<ISectionsModel>();
    public get sectionsModels(): ISectionsModel[] { return this._sectionsModels.toArray(); }

    constructor(copy?: ICoursesModel)
    {
        if (!copy)
        {
            return;
        }
        this.courseId = copy.courseId;
        this.title = copy.title;
        this.description = copy.description;
        copy.courseListings.map((courseListing: string)=>{
            this._courseListings.add(courseListing);
        });
        this.primaryListing = copy.primaryListing;
        copy.sectionsModels.map((sectionsModel: ISectionsModel)=>{
            var newModel = new SectionsModel(sectionsModel);
            newModel.coursesModel = this;
            this._sectionsModels.add(newModel);
        });
    }
}

export = CoursesModel;
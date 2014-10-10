import Courses = require('../Courses/Courses');
import Dictionary = require('../../../library/DataStructures/Dictionary');
import Set = require('../../../library/DataStructures/Set')
import UserProfiles = require('./UserProfiles');

import ICoursesModel = Courses.ICoursesModel;
import ISectionsModel = Courses.ISectionsModel;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;

class UserProfilesModel implements  IUserProfilesModel
{
    private _eventTypes: Dictionary<string, string> = null;
    public get eventTypes(): Dictionary<string, string>
    {
        if (!this._eventTypes)
        {
            this._eventTypes = new Dictionary<string, string>();
        }
        return this._eventTypes;
    }
    public set eventTypes(value: Dictionary<string, string>)
    {
        value = value || new Dictionary<string, string>();
        this._eventTypes = value;
    }


    private _username: string = null;
    public get username(): string { return this._username; }
    public set username(value: string) { this._username = value; }

    private _displayName: string = null;
    public get displayName(): string { return this._displayName; }
    public set displayName(value: string) { this._displayName = value; }

    private _enrolledCoursesModels: Set<ICoursesModel> = new Set<ICoursesModel>();
    public get enrolledCoursesModels(): ICoursesModel[] { return this._enrolledCoursesModels.toArray(); }
    public set enrolledCoursesModels(value: ICoursesModel[])
    {
        if (!value)
        {
            return;
        }
        this._enrolledCoursesModels = new Set<ICoursesModel>(value);
    }

    public get enrolledSectionsModels(): ISectionsModel[]
    {
        return this.enrolledCoursesModels.reduce((sectionsModels: ISectionsModel[], coursesModel: ICoursesModel, index: number)=>{
            return sectionsModels.concat(coursesModel.sectionsModels);
        }, []);
    }

    constructor(copy?: IUserProfilesModel)
    {
        if (copy)
        {
            this.username = copy.username;
            if (copy.displayName)
            {
                this.displayName = copy.displayName;
            }
            if (copy.enrolledCoursesModels)
            {
                this._enrolledCoursesModels = new Set<ICoursesModel>(copy.enrolledCoursesModels);
            }
        }
    }

}

export = UserProfilesModel;
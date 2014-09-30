import Courses = require('../Courses/Courses');
import Set = require('../../../library/DataStructures/Set')
import UserProfiles = require('./UserProfiles');

import ICoursesModel = Courses.ICoursesModel;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;

class UserProfilesModel implements  IUserProfilesModel
{
    private _username: string = null;
    public get username(): string { return this._username; }
    public set username(value: string) { this._username = value; }

    private _displayName: string = null;
    public get displayName(): string { return this._displayName; }
    public set displayName(value: string) { this._displayName = value; }

    private _enrolledCoursesModels: Set<ICoursesModel> = new Set<ICoursesModel>();
    public get enrolledCoursesModels(): ICoursesModel[] { return this._enrolledCoursesModels.toArray(); }

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
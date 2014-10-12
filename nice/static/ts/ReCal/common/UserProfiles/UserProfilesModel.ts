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

    private _hiddenCoursesModels: Set<ICoursesModel> = null;
    private get hiddenCoursesModelsSet(): Set<ICoursesModel>
    {
        if (!this._hiddenCoursesModels)
        {
            this._hiddenCoursesModels = new Set<ICoursesModel>();
        }
        return this._hiddenCoursesModels;
    }
    public get hiddenCoursesModels(): ICoursesModel[]
    {
        return this.hiddenCoursesModelsSet.toArray();
    }
    public set hiddenCoursesModels(value: ICoursesModel[])
    {
        value = value || [];
        this._hiddenCoursesModels = new Set<ICoursesModel>(value);
    }

    private _agendaVisibleEventTypeCodes: Set<string> = null;
    private get agendaVisibleEventTypeCodesSet(): Set<string>
    {
        if (!this._agendaVisibleEventTypeCodes)
        {
            this._agendaVisibleEventTypeCodes = new Set<string>();
        }
        return this._agendaVisibleEventTypeCodes;
    }
    public get agendaVisibleEventTypeCodes(): string[]
    {
        return this.agendaVisibleEventTypeCodesSet.toArray();
    }
    public set agendaVisibleEventTypeCodes(value: string[])
    {
        value = value || [];
        this._agendaVisibleEventTypeCodes = new Set<string>(value);
    }

    private _calendarVisibleEventTypeCodes: Set<string> = null;
    private get calendarVisibleEventTypeCodesSet(): Set<string>
    {
        if (!this._calendarVisibleEventTypeCodes)
        {
            this._calendarVisibleEventTypeCodes = new Set<string>();
        }
        return this._calendarVisibleEventTypeCodes;
    }
    public get calendarVisibleEventTypeCodes(): string[]
    {
        return this.calendarVisibleEventTypeCodesSet.toArray();
    }
    public set calendarVisibleEventTypeCodes(value: string[])
    {
        value = value || [];
        this._calendarVisibleEventTypeCodes = new Set<string>(value);
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
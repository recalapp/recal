import Color = require('../../../library/Color/Color');
import Courses = require('../Courses/Courses');
import CoursesModel = require('../Courses/CoursesModel');
import Dictionary = require('../../../library/DataStructures/Dictionary');
import SectionsModel = require('../Courses/SectionsModel');
import SectionTypesModel = require('../Courses/SectionTypesModel');
import ServerData = require('./ServerData');
import UserProfiles = require('./UserProfiles');

import CourseInfoServerData = ServerData.CourseInfoServerData;
import ICoursesModel = Courses.ICoursesModel;
import ISectionsModel = Courses.ISectionsModel;
import ISectionTypesModel = Courses.ISectionTypesModel;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;
import SectionInfoServerData = ServerData.SectionInfoServerData;
import UserProfileInfoServerData = ServerData.UserProfileInfoServerData;

class UserProfilesServerDataToModelConverter
{
    private get user(): IUserProfilesModel
    {
        return this._user;
    }

    constructor(private _user: IUserProfilesModel)
    {

    }

    private convertSectionDataToModel(data: SectionInfoServerData): ISectionsModel
    {
        return new SectionsModel({
            sectionId: data.section_id.toString(),
            title: data.section_name,
            color: Color.fromHex(data.section_color),
            sectionTypesModel: new SectionTypesModel({
                code: data.section_type_code,
                displayText: data.section_type_code,
            })
        });
    }

    private convertCourseDataToModel(data: CourseInfoServerData): ICoursesModel
    {
        return new CoursesModel({
            courseId: data.course_id.toString(),
            title: data.course_title,
            description: data.course_description,
            courseListings: data.course_listings.split(/\s*\/\s*/),
            primaryListing: data.course_primary_listing,
            sectionsModels: data.sections.map((sectionData)=>{
                return this.convertSectionDataToModel(sectionData);
            })
        });
    }

    public updateUserProfilesModelWithServerData(data: UserProfileInfoServerData): IUserProfilesModel
    {
        this.user.username = data.username;
        this.user.displayName = data.display_name;
        this.user.enrolledCoursesModels =
        data.enrolled_courses.map((courseData)=>{
            return this.convertCourseDataToModel(courseData);
        });
        this.user.eventTypes = new Dictionary<string, string>((a, b)=>{return a === b;},data.event_types);
        this.user.agendaVisibleEventTypeCodes = data.agenda_pref;
        this.user.calendarVisibleEventTypeCodes = data.calendar_pref;
        return this.user;
    }
}

export = UserProfilesServerDataToModelConverter;
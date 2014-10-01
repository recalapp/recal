/// <reference path="../../../typings/tsd.d.ts" />
import $ = require('jquery');

import Dictionary = require('../../../library/DataStructures/Dictionary');
import Courses = require('../Courses/Courses');
import CoursesModel = require('../Courses/CoursesModel');
import SectionsModel = require('../Courses/SectionsModel');
import SectionTypesModel = require('../Courses/SectionTypesModel');
import Server = require('../../../library/Server/Server');
import ServerRequest = require('../../../library/Server/ServerRequest');
import ServerRequestType = require('../../../library/Server/ServerRequestType');
import ServerConnection = require('../../../library/Server/ServerConnection');
import UserProfiles = require('./UserProfiles');

import ICoursesModel = Courses.ICoursesModel;
import ISectionsModel = Courses.ISectionsModel;
import ISectionTypesModel = Courses.ISectionTypesModel;
import IServerConnection = Server.IServerConnection;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;
import IUserProfilesServerCommunicator = UserProfiles.IUserProfilesServerCommunicator;

interface UserProfileInfoServerData
{
    username: string;
    display_name: string;
    enrolled_courses: CourseInfoServerData[];
}
interface CourseInfoServerData
{
    course_description: string;
    course_title: string;
    course_professor: string;
    course_listings: string;
    course_primary_listing: string;
    course_id: number;
    sections: SectionInfoServerData[];
}
interface SectionInfoServerData
{
    section_type_code: string;
    section_id: number;
    section_name: string;
}

class UserProfilesServerCommunicator implements IUserProfilesServerCommunicator
{
    private _serverConnection: IServerConnection = new ServerConnection(1);
    private get serverConnection(): IServerConnection { return this._serverConnection; }

    /**
     * Sync the user profile with the server to get the latest information.
     * Returns a JQuery promise that returns a (potentially new) user profile.
     * @param profile
     */
    public updateUserProfile(profile: IUserProfilesModel): JQueryPromise<IUserProfilesModel>
    {
        var deferred = $.Deferred<IUserProfilesModel>();
        var createServerRequest = ()=>
        {
            var serverRequest = new ServerRequest({
                url: '/get/user_profile_info',
                async: true,
                parameters: new Dictionary<string, string>(),
                requestType: ServerRequestType.get,
            });
            return serverRequest;
        };
        var courseDataToModel = (data: CourseInfoServerData, index: number)=>{
            return new CoursesModel({
                courseId: data.course_id.toString(),
                title: data.course_title,
                description: data.course_description,
                courseListings: data.course_listings.split(/\s*\/\s*/),
                primaryListing: data.course_primary_listing,
                sectionsModels: data.sections.map(sectionDataToModel)
            });
        };
        var sectionDataToModel = (data: SectionInfoServerData, index: number)=>{
            return new SectionsModel({
                sectionId: data.section_id.toString(),
                title: data.section_name,
                sectionTypesModel: new SectionTypesModel({
                    code: data.section_type_code,
                    displayText: data.section_type_code,
                }),
            });
        };
        this.serverConnection.sendRequest(createServerRequest())
            .done((data: UserProfileInfoServerData)=>{
                profile.username = data.username;
                profile.displayName = data.display_name;
                profile.enrolledCoursesModels = data.enrolled_courses.map(courseDataToModel);
                deferred.resolve(profile);
            })
            .fail((data: any)=>{
                deferred.resolve(profile);
            });
        return deferred.promise();
    }
}

export = UserProfilesServerCommunicator;
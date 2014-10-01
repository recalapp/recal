/// <reference path="../../../typings/tsd.d.ts" />

import Courses = require('../Courses/Courses');
import Dictionary = require('../../../library/DataStructures/Dictionary');

import ICoursesModel = Courses.ICoursesModel;
import ISectionsModel = Courses.ISectionsModel;

export interface UserProfilesServerCommunicatorDependencies
{

}

export interface IUserProfilesModel
{
    username: string; // netID
    displayName?: string; // null initially?
    enrolledCoursesModels?: ICoursesModel[]; // null initially
    enrolledSectionsModels?: ISectionsModel[]; // computed based on enrolledCourses
    eventTypes?: Dictionary<string, string>; // mapping from type code to type display for this user (can be different in the future for each user)
}

export interface IUserProfilesServerCommunicator
{
    /**
     * Sync the user profile with the server to get the latest information.
     * Returns a JQuery promise that returns a (potentially new) user profile.
     * @param profile
     */
    updateUserProfile(profile: IUserProfilesModel): JQueryPromise<IUserProfilesModel>;
}
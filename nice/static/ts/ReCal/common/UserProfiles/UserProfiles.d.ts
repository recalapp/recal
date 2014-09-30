/// <reference path="../../../typings/tsd.d.ts" />

import Courses = require('../Courses/Courses');

import ICoursesModel = Courses.ICoursesModel;

export interface IUserProfilesModel
{
    username: string; // netID
    displayName?: string; // null initially?
    enrolledCoursesModels?: ICoursesModel[]; // null initially
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
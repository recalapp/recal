/// <amd-dependency path="angular"/>

import Module = require('../Module');
import ResourceBuilder = require('./ResourceBuilder');
import CourseService = require('./CourseService');
import UserService = require('./UserService');
import ScheduleService = require('./ScheduleService');
import SemesterService = require('./SemesterService');
import ScheduleManagerService = require('./ScheduleManagerService');

var niceServices = angular.module('niceServices', []);

niceServices.factory('ResourceBuilder', ['$resource', 'localStorageService', ($resource, localStorageService) => new ResourceBuilder($resource, localStorageService)]);

niceServices.factory('ScheduleResource', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getScheduleResource()]);
niceServices.factory('CourseResource', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getCourseResource()]);
niceServices.factory('ColorResource', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getColorResource()]);
niceServices.factory('UserResource', ['ResourceBuilder', (builder: ResourceBuilder) => builder.getUserResource()]);
niceServices.factory('FriendResource', ['ResourceBuilder', (builder: ResourceBuilder) => builder.getFriendResource()]);
niceServices.factory('SemesterResource', ['ResourceBuilder', (builder: ResourceBuilder) => builder.getSemesterResource()]);

niceServices.service('CourseService', CourseService);
niceServices.service('UserService', UserService);
niceServices.service('ScheduleService', ScheduleService);
niceServices.service('SemesterService', SemesterService);
niceServices.service('ScheduleManagerService', ScheduleManagerService);

export = niceServices;

/// <amd-dependency path="angular"/>

import Module = require('../Module');
import ResourceBuilder = require('./ResourceBuilder');
import CourseService = require('./CourseService');

var niceServices = angular.module('niceServices', []);

niceServices.factory('ResourceBuilder', ['$resource', 'localStorageService', ($resource, localStorageService) => new ResourceBuilder($resource, localStorageService)]);

niceServices.factory('ScheduleResource', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getScheduleResource()]);
niceServices.factory('CourseResource', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getCourseResource()]);
niceServices.factory('ColorResource', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getColorResource()]);
niceServices.factory('UserResource', ['ResourceBuilder', (builder: ResourceBuilder) => builder.getUserResource()]);

niceServices.service('CourseService', CourseService);

export = niceServices;

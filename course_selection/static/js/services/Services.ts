/// <amd-dependency path="angular"/>

import Module = require('../Module');
import ResourceBuilder = require('./ResourceBuilder');

var niceServices = angular.module('niceServices', []);
//niceServices.addService('CourseResource', CourseResource);
niceServices.factory('ResourceBuilder', ['$resource', 'localStorageService', ($resource, localStorageService) => new ResourceBuilder($resource, localStorageService)]);

niceServices.factory('CourseResource', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getCourseResource()]);
niceServices.factory('TestSharingService', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getTestSharingService()]);
niceServices.factory('ColorResource', ["ResourceBuilder", (builder: ResourceBuilder) => builder.getColorResource()]);

export = niceServices;

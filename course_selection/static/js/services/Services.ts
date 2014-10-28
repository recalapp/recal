import Module = require('../Module');
import CourseResource = require('./CourseResource');

var niceServices = new Module('niceServices', []);
niceServices.addService('CourseResource', CourseResource);

export = niceServices;

define(["require", "exports", '../Module', './CourseResource'], function(require, exports, Module, CourseResource) {
    var niceServices = new Module('niceServices', []);
    niceServices.addService('CourseResource', CourseResource);

    
    return niceServices;
});

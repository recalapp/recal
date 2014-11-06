define(["require", "exports", '../Module', './CourseSearchFilter'], function(require, exports, Module, CourseSearchFilter) {
    var niceFilters = new Module('niceFilters', []);
    niceFilters.addFilter('courseSearchFilter', function () {
        return CourseSearchFilter.Factory();
    });

    
    return niceFilters;
});

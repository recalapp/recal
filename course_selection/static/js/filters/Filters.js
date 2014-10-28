define(["require", "exports", '../Module', './CourseSearchFilter'], function(require, exports, Module, CourseSearchFilter) {
    var niceFilters = new Module('niceFilters', []);
    niceFilters.addFilter('courseSearchFilter', CourseSearchFilter.Factory());

    
    return niceFilters;
});
//# sourceMappingURL=Filters.js.map

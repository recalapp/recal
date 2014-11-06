import Module = require('../Module');
import CourseSearchFilter = require('./CourseSearchFilter');

var niceFilters = new Module('niceFilters', []);
niceFilters.addFilter('courseSearchFilter', () => {
    return CourseSearchFilter.Factory()
});

export = niceFilters;

import Module = require('../Module');
import CourseSearchFilter = require('./CourseSearchFilter');

var niceFilters = new Module('niceFilters', []);
niceFilters.addFilter('courseSearchFilter', CourseSearchFilter.Factory());

export = niceFilters;

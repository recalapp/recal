import Module = require('../Module');
import CourseSearchFilter = require('./CourseSearchFilter');
import HighlightFilter = require('./HighlightFilter');

var niceFilters = new Module('niceFilters', []);
niceFilters.addFilter('courseSearch', [() => {
    return new CourseSearchFilter().filter
}]);

niceFilters.addFilter('highlight', ['$sce', ($sce) => {
    return (text, input) => {
        return new HighlightFilter($sce).filter(text, input)
    }
}]);

export = niceFilters;

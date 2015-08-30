define(["require", "exports", '../Module', './CourseSearchFilter', './FriendSearchFilter', './HighlightFilter'], function (require, exports, Module, CourseSearchFilter, FriendSearchFilter, HighlightFilter) {
    var niceFilters = new Module('niceFilters', []);
    niceFilters.addFilter('courseSearch', [function () {
            return new CourseSearchFilter().filter;
        }]);
    niceFilters.addFilter('friendSearch', [function () {
            return new FriendSearchFilter().filter;
        }]);
    niceFilters.addFilter('highlight', ['$sce', function ($sce) {
            return function (text, input) {
                return new HighlightFilter($sce).filter(text, input);
            };
        }]);
    return niceFilters;
});

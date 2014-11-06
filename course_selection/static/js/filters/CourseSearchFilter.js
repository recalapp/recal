/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Filter'], function(require, exports, Filter) {
    var CourseSearchFilter = (function (_super) {
        __extends(CourseSearchFilter, _super);
        function CourseSearchFilter() {
            _super.apply(this, arguments);
        }
        CourseSearchFilter.Factory = function () {
            return function (courses, query) {
                console.log("query: " + query);
                var filtered = [];
                angular.forEach(courses, function (course) {
                    if (course.title.substr(0, query.length).toLowerCase() == query.toLowerCase()) {
                        filtered.push(course);
                    }
                });
                return filtered;
            };
        };
        return CourseSearchFilter;
    })(Filter);

    
    return CourseSearchFilter;
});

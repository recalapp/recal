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
            _super.call(this);
        }
        CourseSearchFilter.prototype.filter = function (courses, input) {
            if (courses.length == 0) {
                return courses;
            }

            if (!input) {
                if (courses[0].enrolled) {
                    return courses;
                } else {
                    return [];
                }
            }

            var breakedQueries = CourseSearchFilter.breakQuery(input);
            var queries = breakedQueries.split(' ');
            var results = courses;
            for (var i = 0; i < queries.length; i++) {
                var query = queries[i].toUpperCase();
                if (query == '') {
                    continue;
                }

                if (query[0] == '>') {
                    i++;

                    if (i >= queries.length || !CourseSearchFilter.isNumber(queries[i])) {
                        continue;
                    }

                    var minRating = +queries[i];
                    results = results.filter(function (course) {
                        return course.rating >= minRating;
                    });
                } else if (query.length <= 3 && CourseSearchFilter.isAlpha(query)) {
                    if (query.length < 3) {
                        return [];
                    }

                    results = results.filter(function (course) {
                        return CourseSearchFilter.isListed(course, 'course_listings', 'dept', query);
                    });
                } else if (query.length <= 4 && CourseSearchFilter.isNumber(query)) {
                    results = results.filter(function (course) {
                        return CourseSearchFilter.isListed(course, 'course_listings', 'number', query);
                    });
                } else {
                    results = results.filter(function (course) {
                        return CourseSearchFilter.regexTest(course, query);
                    });
                }
            }

            return results;
        };

        CourseSearchFilter.breakQuery = function (input) {
            var output;

            output = input.replace(/\d+\.?\d*/g, function (text) {
                return ' ' + text + ' ';
            });

            output = output.replace(/\D\.\d+/g, function (text) {
                return ' ' + text + ' ';
            });

            output = output.replace(/\s+/g, " ");

            return output;
        };

        CourseSearchFilter.regexTest = function (course, regexStr) {
            var re = new RegExp(regexStr, "i");
            if (re.test(course.title)) {
                return true;
            }

            return false;
        };

        CourseSearchFilter.isListed = function (course, first_arg, second_arg, target) {
            if (!course[first_arg]) {
                return false;
            }

            var listings = course[first_arg];
            for (var i = 0; i < listings.length; i++) {
                var listing = listings[i];
                if (CourseSearchFilter.startsWith(listing[second_arg], target)) {
                    return true;
                }
            }

            return false;
        };

        CourseSearchFilter.startsWith = function (s, t) {
            return s.substring(0, t.length) === t;
        };

        CourseSearchFilter.isDepartment = function (input) {
        };

        CourseSearchFilter.isAlpha = function (s) {
            return s.search(/[^A-Za-z\s]/) == -1;
        };

        CourseSearchFilter.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
        };

        CourseSearchFilter.arrayContains = function (xs, x) {
            return xs.indexOf(x) != -1;
        };
        CourseSearchFilter.dists = ['LA', 'SA', 'HA', 'EM', 'QR', 'STL', 'STN'];

        CourseSearchFilter.$inject = [];
        return CourseSearchFilter;
    })(Filter);

    
    return CourseSearchFilter;
});
//# sourceMappingURL=CourseSearchFilter.js.map

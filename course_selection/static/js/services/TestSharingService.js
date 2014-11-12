define(["require", "exports"], function(require, exports) {
    var TestSharingService = (function () {
        function TestSharingService() {
            this.data = {
                foo: 'foo',
                bar: 'bar',
                previewCourse: null,
                enrolledCourses: []
            };
            this.data.previewCourse = null;
            this.data.enrolledCourses = [];
        }
        TestSharingService.prototype.getData = function () {
            return this.data;
        };

        TestSharingService.prototype.setPreviewCourse = function (course) {
            this.data.previewCourse = course;
        };

        TestSharingService.prototype.clearPreviewCourse = function () {
            this.setPreviewCourse(null);
        };

        TestSharingService.prototype.enrollCourse = function (course) {
            this.data.enrolledCourses.push(course);
        };

        TestSharingService.prototype.unenrollCourse = function (course) {
            var enrolledCourses = this.data.enrolledCourses;
            var idx = this.courseIdxInList(course, enrolledCourses);
            enrolledCourses.splice(idx, 1);
        };

        TestSharingService.prototype.courseIdxInList = function (course, list) {
            for (var i = 0; i < list.length; i++) {
                if (course.id == list[i].id) {
                    return i;
                }
            }

            return TestSharingService.NOT_FOUND;
        };

        TestSharingService.prototype.isCourseEnrolled = function (course) {
            var idx = this.courseIdxInList(course, this.data.enrolledCourses);
            return idx != TestSharingService.NOT_FOUND;
        };

        /////////////////////////////////////////////////////////////////////
        // TODO: these should be moved to a class called Course that
        // implements ICourse
        TestSharingService.prototype.getPrimaryCourseListing = function (course) {
            for (var i = 0; i < course.course_listings.length; i++) {
                var curr = course.course_listings[i];
                if (curr.is_primary) {
                    return curr.dept + curr.number;
                }
            }

            return "";
        };

        TestSharingService.prototype.getAllCourseListings = function (course) {
            if (!course) {
                console.log("getAllCourseListings's input is " + course);
                return '';
            }

            var listings = [];
            for (var i = 0; i < course.course_listings.length; i++) {
                var curr = course.course_listings[i];
                if (curr.is_primary) {
                    listings.unshift(curr.dept + curr.number);
                } else {
                    listings.push(curr.dept + curr.number);
                }
            }

            return listings.join(' / ');
        };
        TestSharingService.NOT_FOUND = -1;
        return TestSharingService;
    })();

    
    return TestSharingService;
});

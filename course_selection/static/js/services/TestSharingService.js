define(["require", "exports"], function(require, exports) {
    var TestSharingService = (function () {
        function TestSharingService() {
            /* maybe this service shouldn't know about any course/section being previewed? */
            this.data = {
                previewCourse: null,
                enrolledCourses: [],
                previewSection: null,
                enrolledSections: null
            };
            this.preview = {
                course: null,
                section: null
            };
            this.data.previewCourse = null;
            this.data.enrolledCourses = [];
            this.data.enrolledSections = {};
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

            // example--
            // enrolledSections:
            // {
            //      1: {
            //          LEC: null,
            //          PRE: null
            //      },
            //      2: {
            //          STU: 01,
            //          CLA: null
            //      }
            // }
            this.data.enrolledSections[course.id] = {};
            for (var i = 0; i < course.section_types.length; i++) {
                var section_type = course.section_types[i];
                this.data.enrolledSections[course.id][section_type] = null;
            }
        };

        TestSharingService.prototype.unenrollCourse = function (course) {
            var enrolledCourses = this.data.enrolledCourses;
            var idx = this.courseIdxInList(course, enrolledCourses);
            enrolledCourses.splice(idx, 1);
        };

        TestSharingService.prototype.setPreviewSection = function (section) {
        };

        TestSharingService.prototype.clearPreviewSection = function (section) {
        };

        TestSharingService.prototype.enrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = section.id;
        };

        TestSharingService.prototype.unenrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = null;
        };

        TestSharingService.prototype.isSectionEnrolled = function (section) {
            var enrolledCourse = this.data.enrolledSections[section.course_id];
            return enrolledCourse != null && enrolledCourse[section.section_type] == section.id;
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
        TestSharingService.NOT_FOUND = -1;
        return TestSharingService;
    })();

    
    return TestSharingService;
});

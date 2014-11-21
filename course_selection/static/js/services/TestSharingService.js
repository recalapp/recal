define(["require", "exports", '../models/Course'], function(require, exports, Course) {
    var TestSharingService = (function () {
        function TestSharingService(courseResource, localStorageService) {
            this.courseResource = courseResource;
            this.localStorageService = localStorageService;
            this.data = {
                previewCourse: null,
                enrolledCourses: [],
                previewSection: null,
                enrolledSections: null,
                courses: []
            };
            this.preview = {
                course: null,
                section: null
            };
            var termCode = 1154;
            this.data.previewCourse = null;
            this.data.enrolledCourses = [];
            this.data.enrolledSections = {};
            this.loadCourses(termCode);
        }
        TestSharingService.prototype.loadCourses = function (termCode) {
            var _this = this;
            var temp = this.localStorageService.get('courses-' + termCode);
            if (temp != null && Array.isArray(temp)) {
                this.data.courses = temp;
            } else {
                this.courseResource.get({ semester__term_code: termCode }, function (data) {
                    _this.onLoaded(data, termCode);
                });
            }
        };

        TestSharingService.prototype.onLoaded = function (data, termCode) {
            this.data.courses = data['objects'].map(function (course) {
                return new Course(course.title, course.description, course.course_listings, course.id, course.sections, course.semester);
            });

            this.localStorageService.set('courses-' + termCode, this.data.courses);
        };

        TestSharingService.prototype.getData = function () {
            return this.data;
        };

        TestSharingService.prototype.getCourseById = function (id) {
            return this.data.courses.filter(function (course) {
                return course.id == id;
            })[0];
        };

        TestSharingService.prototype.setPreviewCourse = function (course) {
            this.data.previewCourse = course;
        };

        TestSharingService.prototype.clearPreviewCourse = function () {
            this.setPreviewCourse(null);
        };

        TestSharingService.prototype.enrollCourse = function (course) {
            this.data.enrolledCourses.push(course);

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

            this.data.enrolledSections[course.id] = null;
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
        TestSharingService.NOT_FOUND = -1;
        return TestSharingService;
    })();

    
    return TestSharingService;
});
//# sourceMappingURL=TestSharingService.js.map

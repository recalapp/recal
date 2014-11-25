define(["require", "exports", './Course'], function(require, exports, Course) {
    var CourseManager = (function () {
        function CourseManager(courseResource, localStorageService, termCode) {
            this.courseResource = courseResource;
            this.localStorageService = localStorageService;
            this.termCode = termCode;
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
            this.data.previewCourse = null;
            this.data.enrolledCourses = [];
            this.data.enrolledSections = {};
            this.loadCourses();
        }
        CourseManager.prototype.loadCourses = function () {
            var _this = this;
            var temp = this.localStorageService.get('courses-' + this.termCode);
            if (temp != null && Array.isArray(temp)) {
                this.data.courses = temp;
            } else {
                this.courseResource.get({ semester__term_code: this.termCode }, function (data) {
                    _this.onLoaded(data);
                });
            }
        };

        CourseManager.prototype.onLoaded = function (data) {
            this.data.courses = data['objects'].map(function (course) {
                return new Course(course.title, course.description, course.course_listings, course.id, course.sections, course.semester);
            });

            this.localStorageService.set('courses-' + this.termCode, this.data.courses);
        };

        CourseManager.prototype.getData = function () {
            return this.data;
        };

        ///////////////////////////////////////////////////////////
        // Course Management
        //////////////////////////////////////////////////////////
        CourseManager.prototype.getCourseById = function (id) {
            return this.data.courses.filter(function (course) {
                return course.id == id;
            })[0];
        };

        ///////////////////////////////////////////////////////////
        // Course Enrollment Management
        //////////////////////////////////////////////////////////
        CourseManager.prototype.setPreviewCourse = function (course) {
            this.data.previewCourse = course;
        };

        CourseManager.prototype.clearPreviewCourse = function () {
            this.setPreviewCourse(null);
        };

        CourseManager.prototype.enrollCourse = function (course) {
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

        CourseManager.prototype.unenrollCourse = function (course) {
            var enrolledCourses = this.data.enrolledCourses;
            var idx = this.courseIdxInList(course, enrolledCourses);
            enrolledCourses.splice(idx, 1);

            this.data.enrolledSections[course.id] = null;
        };

        CourseManager.prototype.courseIdxInList = function (course, list) {
            for (var i = 0; i < list.length; i++) {
                if (course.id == list[i].id) {
                    return i;
                }
            }

            return CourseManager.NOT_FOUND;
        };

        CourseManager.prototype.isCourseEnrolled = function (course) {
            var idx = this.courseIdxInList(course, this.data.enrolledCourses);
            return idx != CourseManager.NOT_FOUND;
        };

        ///////////////////////////////////////////////////////////
        // Section Enrollment Management
        //////////////////////////////////////////////////////////
        CourseManager.prototype.setPreviewSection = function (section) {
        };

        CourseManager.prototype.clearPreviewSection = function (section) {
        };

        CourseManager.prototype.enrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = section.id;
        };

        CourseManager.prototype.unenrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = null;
        };

        CourseManager.prototype.isSectionEnrolled = function (section) {
            var enrolledCourse = this.data.enrolledSections[section.course_id];
            return enrolledCourse != null && enrolledCourse[section.section_type] == section.id;
        };
        CourseManager.NOT_FOUND = -1;
        return CourseManager;
    })();

    
    return CourseManager;
});

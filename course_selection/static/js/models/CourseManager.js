/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports", './Course'], function(require, exports, Course) {
    var CourseManager = (function () {
        function CourseManager($rootScope, courseService, localStorageService, colorManager, schedule) {
            this.$rootScope = $rootScope;
            this.courseService = courseService;
            this.localStorageService = localStorageService;
            this.colorManager = colorManager;
            this.schedule = schedule;
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
            var prevEnrollments = schedule.enrollments ? JSON.parse(schedule.enrollments) : null;
            this._initData(prevEnrollments);
            this._initWatches();
        }
        ///////////////////////////////////////////////////////////
        // Initialization
        //////////////////////////////////////////////////////////
        CourseManager.prototype._initData = function (prevEnrollments) {
            this.data.previewCourse = null;
            this.data.enrolledCourses = [];
            this.data.enrolledSections = {};

            this._loadCourses(prevEnrollments);
        };

        CourseManager.prototype._initWatches = function () {
            var _this = this;
            this.$rootScope.$watch(function () {
                return _this.data.enrolledSections;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                // we need to post stuff in the form of
                // {
                //  semester: ...
                //  user: ...
                //  available_colors: [{
                //  }],
                //  enrollments: []
                // }
                var enrollments = _this._constructEnrollments(newValue);
                _this.schedule.enrollments = JSON.stringify(enrollments);
                _this.schedule.$update().then(function (updatedSchedule) {
                    console.log('schedule updated');
                });
            }, true);
        };

        CourseManager.prototype._constructEnrollments = function (enrolledSections) {
            var _this = this;
            var enrollments = [];
            angular.forEach(enrolledSections, function (courseEnrollment, courseId) {
                var enrollment = {
                    course_id: null,
                    color: null,
                    sections: []
                };

                enrollment.course_id = +courseId;

                // TODO: is it dangerous to do this?
                // 1: there should be a better function than filter for the job
                // 2: what if course.colors changes? does that affect this enrollment object?
                enrollment.color = _this.data.enrolledCourses.filter(function (course) {
                    return course.id == +courseId;
                })[0].colors;
                angular.forEach(courseEnrollment, function (sectionId, sectionType) {
                    if (sectionId != null) {
                        enrollment.sections.push(sectionId);
                    }
                });

                enrollments.push(enrollment);
            });

            return enrollments;
        };

        // map raw data into more flexible data structure
        CourseManager.prototype._transformCourse = function (rawCourse) {
            return new Course(rawCourse.title, rawCourse.description, rawCourse.course_listings, rawCourse.id, rawCourse.sections, rawCourse.semester);
        };

        CourseManager.prototype._loadCourses = function (prevEnrollments) {
            var _this = this;
            this.courseService.getBySemester(this.schedule.semester.term_code).then(function (courses) {
                _this.data.courses = courses.map(_this._transformCourse);
            }).then(function () {
                if (prevEnrollments) {
                    for (var i = 0; i < prevEnrollments.length; i++) {
                        var enrollment = prevEnrollments[i];
                        var course = _this.getCourseById(enrollment.course_id);
                        course.colors = enrollment.color;
                        _this._enrollCourse(course);
                        _this._enrollSections(course, enrollment.sections);
                    }
                }
            });
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

        CourseManager.prototype._enrollCourse = function (course) {
            var idx = this._courseIdxInList(course, this.data.courses);
            this.data.courses.splice(idx, 1);
            this.data.enrolledCourses.push(course);
        };

        CourseManager.prototype._enrollSections = function (course, sectionIds) {
            this.data.enrolledSections[course.id] = {};
            for (var i = 0; i < course.section_types.length; i++) {
                var section_type = course.section_types[i];
                this.data.enrolledSections[course.id][section_type] = null;
            }

            for (var i = 0; i < course.sections.length; i++) {
                var section = course.sections[i];
                if (!section.has_meetings) {
                    this.enrollSection(section);
                }

                if (this._isInList(section.id, sectionIds)) {
                    this.enrollSection(section);
                }
            }
        };

        CourseManager.prototype._unenrollCourse = function (course) {
            this._removeCourseFromList(course, this.data.enrolledCourses);
            this.data.courses.push(course);
        };

        CourseManager.prototype._unenrollSections = function (course) {
            this.data.enrolledSections[course.id] = null;
        };

        /**
        * NOTE: the input course is modified
        */
        CourseManager.prototype.enrollCourse = function (course) {
            course.colors = this.colorManager.nextColor();
            this._enrollCourse(course);
            this._enrollSections(course);
        };

        /**
        * NOTE: the input course is modified
        */
        CourseManager.prototype.unenrollCourse = function (course) {
            // remove color set in the course object
            this.colorManager.addColor(course.colors);
            course.colors = null;

            this._unenrollCourse(course);
            this._unenrollSections(course);
        };

        CourseManager.prototype._removeCourseFromList = function (course, list) {
            var idx = this._courseIdxInList(course, list);
            list.splice(idx, 1);
        };

        // TODO: this is a linear traversal. Optimize if this causes
        // performance issues
        CourseManager.prototype._idxInList = function (element, list, comp) {
            var idx = CourseManager.NOT_FOUND;
            var comp = comp ? comp : this._defaultComp;
            angular.forEach(list, function (value, key) {
                if (comp(element, value)) {
                    idx = key;
                    return;
                }
            });

            return idx;
        };

        CourseManager.prototype._defaultComp = function (a, b) {
            return a == b;
        };

        CourseManager.prototype._isInList = function (element, list, comp) {
            return this._idxInList(element, list, comp) != CourseManager.NOT_FOUND;
        };

        CourseManager.prototype._courseComp = function (a, b) {
            return a.id == b.id;
        };

        CourseManager.prototype._sectionComp = function (a, b) {
            return a.id == b.id;
        };

        CourseManager.prototype._courseIdxInList = function (course, list) {
            return this._idxInList(course, list, this._courseComp);
        };

        CourseManager.prototype.isCourseEnrolled = function (course) {
            var idx = this._courseIdxInList(course, this.data.enrolledCourses);
            return idx != CourseManager.NOT_FOUND;
        };

        ///////////////////////////////////////////////////////////
        // Section Enrollment Management
        //////////////////////////////////////////////////////////
        CourseManager.prototype.setPreviewSection = function (section) {
        };

        CourseManager.prototype.clearPreviewSection = function (section) {
        };

        // private _enrollSection(courseId, sectionId, sectionType): void {
        //     this.data.enrolledSections[courseId][sectionType] = sectionId;
        // }
        CourseManager.prototype.enrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = section.id;
        };

        CourseManager.prototype.isCourseAllSectionsEnrolled = function (course) {
            var allSectionsEnrolled = true;
            if (!this.isCourseEnrolled(course)) {
                return false;
            }

            var enrollments = this.data.enrolledSections[course.id];
            angular.forEach(enrollments, function (value, key) {
                // key is section_type, value is enrolled section id, if exists
                if (!value) {
                    allSectionsEnrolled = false;
                    return false;
                }
            });

            return allSectionsEnrolled;
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

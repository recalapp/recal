/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports", './Course', '../models/ColorManager', '../Utils'], function(require, exports, Course, ColorManager, Utils) {
    var ScheduleManager = (function () {
        function ScheduleManager($rootScope, courseService, localStorageService, colorResource, schedule) {
            this.$rootScope = $rootScope;
            this.courseService = courseService;
            this.localStorageService = localStorageService;
            this.colorResource = colorResource;
            this.schedule = schedule;
            this.data = {
                previewCourse: null,
                enrolledCourses: [],
                previewSection: null,
                enrolledSections: null,
                schedule: null,
                courses: []
            };
            this.preview = {
                course: null,
                section: null
            };
            var prevEnrollments = schedule.enrollments ? JSON.parse(schedule.enrollments) : null;
            var availableColors = schedule.available_colors ? JSON.parse(schedule.available_colors) : null;
            this._initData(prevEnrollments);
            this._initColorManager(availableColors, prevEnrollments);
            this._initWatches();
        }
        ///////////////////////////////////////////////////////////
        // Initialization
        //////////////////////////////////////////////////////////
        ScheduleManager.prototype._initData = function (prevEnrollments) {
            this.data.previewCourse = null;
            this.data.enrolledCourses = [];
            this.data.enrolledSections = {};
            this.data.schedule = this.schedule;

            this._loadCourses(prevEnrollments);
        };

        ScheduleManager.prototype._initColorManager = function (availableColors, prevEnrollments) {
            var _this = this;
            this.colorManager = new ColorManager(this.colorResource, availableColors, prevEnrollments);

            if (!availableColors) {
                this.colorManager.availableColors.$promise.then(function (colors) {
                    _this.schedule.available_colors = JSON.stringify(colors);
                    _this.schedule.$save();
                });
            }
        };

        ScheduleManager.prototype._initWatches = function () {
            var _this = this;
            this.$rootScope.$watch(function () {
                return _this.data.enrolledSections;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                var enrollments = _this._constructEnrollments(newValue);
                _this.schedule.enrollments = JSON.stringify(enrollments);
                _this.schedule.$update().then(function (updatedSchedule) {
                    console.log('schedule updated');
                });
            }, true);
        };

        ScheduleManager.prototype._constructEnrollments = function (enrolledSections) {
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
        ScheduleManager.prototype._transformCourse = function (rawCourse) {
            return new Course(rawCourse.title, rawCourse.description, rawCourse.course_listings, rawCourse.id, rawCourse.registrar_id, rawCourse.sections, rawCourse.semester);
        };

        ScheduleManager.prototype._loadCourses = function (prevEnrollments) {
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

        ScheduleManager.prototype.getData = function () {
            return this.data;
        };

        ///////////////////////////////////////////////////////////
        // Course Management
        //////////////////////////////////////////////////////////
        ScheduleManager.prototype.getCourseById = function (id) {
            return this.data.courses.filter(function (course) {
                return course.id == id;
            })[0];
        };

        ///////////////////////////////////////////////////////////
        // Course Enrollment Management
        //////////////////////////////////////////////////////////
        ScheduleManager.prototype.setPreviewCourse = function (course) {
            this.data.previewCourse = course;
        };

        ScheduleManager.prototype.clearPreviewCourse = function () {
            this.setPreviewCourse(null);
        };

        ScheduleManager.prototype._enrollCourse = function (course) {
            var idx = this._courseIdxInList(course, this.data.courses);
            this.data.courses.splice(idx, 1);
            this.data.enrolledCourses.push(course);
        };

        ScheduleManager.prototype._enrollSections = function (course, sectionIds) {
            // TODO: assert invariants
            this.data.enrolledSections[course.id] = {};
            for (var i = 0; i < course.section_types.length; i++) {
                var section_type = course.section_types[i];
                this.data.enrolledSections[course.id][section_type] = null;
            }

            for (var i = 0; i < course.sections.length; i++) {
                var section = course.sections[i];

                // got rid of the logic for sections that have no meetings
                // it should be implied because the only available section
                // is automatically enrolled
                // if (!section.has_meetings) {
                // }
                if (!sectionIds) {
                    if (this._isTheOnlySectionOfType(course, section)) {
                        this.enrollSection(section);
                    }
                } else {
                    if (Utils.isInList(section.id, sectionIds)) {
                        this.enrollSection(section);
                    }
                }
            }
        };

        ScheduleManager.prototype._isTheOnlySectionOfType = function (course, section) {
            var filtered = course.sections.filter(function (temp) {
                return temp.section_type == section.section_type;
            });
            return filtered.length == 1 && filtered[0].id == section.id;
        };

        ScheduleManager.prototype._unenrollCourse = function (course) {
            this._removeCourseFromList(course, this.data.enrolledCourses);
            this.data.courses.push(course);
        };

        ScheduleManager.prototype._unenrollSections = function (course) {
            this.data.enrolledSections[course.id] = null;
            delete this.data.enrolledSections[course.id];
        };

        /**
        * NOTE: the input course is modified
        */
        ScheduleManager.prototype.enrollCourse = function (course) {
            course.colors = this.colorManager.nextColor();
            this._enrollCourse(course);
            this._enrollSections(course);
        };

        /**
        * NOTE: the input course is modified
        */
        ScheduleManager.prototype.unenrollCourse = function (course) {
            // remove color set in the course object
            this.colorManager.addColor(course.colors);
            course.resetColor();

            this._unenrollCourse(course);
            this._unenrollSections(course);
        };

        ScheduleManager.prototype._removeCourseFromList = function (course, list) {
            var idx = this._courseIdxInList(course, list);
            list.splice(idx, 1);
        };

        ScheduleManager.prototype._courseComp = function (a, b) {
            return a.id == b.id;
        };

        ScheduleManager.prototype._sectionComp = function (a, b) {
            return a.id == b.id;
        };

        ScheduleManager.prototype._courseIdxInList = function (course, list) {
            return Utils.idxInList(course, list, this._courseComp);
        };

        ScheduleManager.prototype.isCourseEnrolled = function (course) {
            var idx = this._courseIdxInList(course, this.data.enrolledCourses);
            return idx != ScheduleManager.NOT_FOUND;
        };

        ///////////////////////////////////////////////////////////
        // Section Enrollment Management
        //////////////////////////////////////////////////////////
        ScheduleManager.prototype.setPreviewSection = function (section) {
        };

        ScheduleManager.prototype.clearPreviewSection = function (section) {
        };

        // private _enrollSection(courseId, sectionId, sectionType): void {
        //     this.data.enrolledSections[courseId][sectionType] = sectionId;
        // }
        ScheduleManager.prototype.enrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = section.id;
        };

        ScheduleManager.prototype.isCourseAllSectionsEnrolled = function (course) {
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

        ScheduleManager.prototype.unenrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = null;
        };

        ScheduleManager.prototype.isSectionEnrolled = function (section) {
            var enrolledCourse = this.data.enrolledSections[section.course_id];
            return enrolledCourse != null && enrolledCourse[section.section_type] == section.id;
        };
        ScheduleManager.NOT_FOUND = -1;
        return ScheduleManager;
    })();

    
    return ScheduleManager;
});

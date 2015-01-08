define(["require", "exports", '../models/CourseEventSources', '../models/CompositeEventSources'], function(require, exports, CourseEventSources, CompositeEventSources) {
    'use strict';

    var CalendarCtrl = (function () {
        function CalendarCtrl($scope) {
            var _this = this;
            this.$scope = $scope;
            this.courseWatchInitRun = true;
            this.sectionWatchInitRun = true;
            this.calendarWatchInitRun = true;

            this.scheduleManager = this.$scope.$parent.schedule.scheduleManager;
            this.$scope.data = this.scheduleManager.getData();

            this.compositeEventSources = new CompositeEventSources();
            this.$scope.eventSources = this.compositeEventSources.getEventSources();

            this.$scope.$watch(function () {
                return _this._isVisible();
            }, function (newValue, oldValue) {
                if (_this.calendarWatchInitRun && newValue == true) {
                    _this.initConfig();
                    _this.calendarWatchInitRun = false;
                }
            });

            this.$scope.$watch(function () {
                return _this.$scope.data.previewCourse;
            }, function (newCourse, oldCourse) {
                return _this.updatePreviewCourse(newCourse, oldCourse);
            }, true);

            this.$scope.$watchCollection(function () {
                return _this.$scope.data.enrolledCourses;
            }, function (newCourses, oldCourses) {
                return _this.updateEnrolledCourses(newCourses, oldCourses);
            });

            this.$scope.$watch(function () {
                return _this.$scope.data.enrolledSections;
            }, function (newSections, oldSections) {
                return _this.updateEnrolledSections(newSections, oldSections);
            }, true);
        }
        CalendarCtrl.prototype._isVisible = function () {
            return this.$scope.myCalendar && this.$scope.myCalendar.is(":visible");
        };

        CalendarCtrl.prototype.initConfig = function () {
            var _this = this;
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
            this.$scope.uiConfig.eventClick = function (calEvent, jsEvent, view) {
                return _this.onEventClick(calEvent, jsEvent, view);
            };
        };

        CalendarCtrl.prototype.addCourse = function (course, isPreview) {
            var courseEventSources = new CourseEventSources(course, course.colors, isPreview);
            this.compositeEventSources.addEventSources(courseEventSources);
        };

        CalendarCtrl.prototype.removeCourse = function (course, isPreview) {
            this.compositeEventSources.removeEventSources(course.id, isPreview);
        };

        CalendarCtrl.prototype.clearPreviewCourse = function (course) {
            this.removeCourse(course, true);
        };

        CalendarCtrl.prototype.setPreviewCourse = function (course) {
            this.addCourse(course, true);
        };

        CalendarCtrl.prototype.updatePreviewCourse = function (newCourse, oldCourse) {
            if (newCourse === oldCourse || (newCourse !== null && oldCourse !== null && newCourse.id === oldCourse.id))
                return;

            if (newCourse == null) {
                this.clearPreviewCourse(oldCourse);
            } else {
                this.setPreviewCourse(newCourse);
            }

            this.$scope.eventSources = this.compositeEventSources.getEventSources();
        };

        CalendarCtrl.prototype.getRemovedCourse = function (newCourses, oldCourses) {
            var removedIdx = CalendarCtrl.NOT_FOUND;
            for (var i = 0; i < newCourses.length; i++) {
                if (newCourses[i].id !== oldCourses[i].id) {
                    removedIdx = i;
                    break;
                }
            }

            if (removedIdx == CalendarCtrl.NOT_FOUND) {
                removedIdx = newCourses.length;
            }

            return oldCourses[removedIdx];
        };

        CalendarCtrl.prototype.updateEnrolledCourses = function (newCourses, oldCourses) {
            if (this.courseWatchInitRun && newCourses.length > 0) {
                this.courseWatchInitRun = false;
                for (var i = 0; i < newCourses.length; i++) {
                    this.addCourse(newCourses[i], false);
                }

                return;
            }

            if (newCourses === oldCourses)
                return;

            if (newCourses.length == oldCourses.length + 1) {
                var course = newCourses[newCourses.length - 1];
                this.addCourse(course, false);
            } else if (newCourses.length == oldCourses.length - 1) {
                var removedCourse = this.getRemovedCourse(newCourses, oldCourses);
                this.removeCourse(removedCourse, false);
            }

            this.$scope.eventSources = this.compositeEventSources.getEventSources();
        };

        CalendarCtrl.prototype.addAllSectionEventSources = function (course, colors) {
            for (var i = 0; i < course.section_types.length; i++) {
            }
        };

        CalendarCtrl.prototype.removeAllSectionEventSources = function (course) {
            for (var i = this.$scope.eventSources.length - 1; i >= 0; i--) {
                var curr = this.$scope.eventSources[i];
                if (curr.course_id == course.id) {
                    this.$scope.eventSources.splice(i, 1);
                }
            }
        };

        CalendarCtrl.prototype.updateEnrolledSections = function (newSections, oldSections) {
            var _this = this;
            if (this.sectionWatchInitRun) {
                if (Object.getOwnPropertyNames(newSections).length == 0) {
                    return;
                }

                this.sectionWatchInitRun = false;
                angular.forEach(newSections, function (enrollments, courseId) {
                    angular.forEach(enrollments, function (enrolledSectionId, sectionType) {
                        if (enrolledSectionId == null) {
                            _this.compositeEventSources.previewAllCourseSection(courseId, sectionType);
                        } else {
                            _this.compositeEventSources.enrollInCourseSection(courseId, sectionType, enrolledSectionId);
                        }
                    });
                });

                return;
            }

            if (newSections == oldSections) {
                return;
            }

            if (Object.keys(newSections).length != Object.keys(oldSections).length) {
                return;
            }

            for (var course_id in newSections) {
                if (JSON.stringify(newSections[course_id]) != JSON.stringify(oldSections[course_id])) {
                    var old = oldSections[course_id];
                    var curr = newSections[course_id];
                    for (var section_type in curr) {
                        if (old != null && curr[section_type] == old[section_type]) {
                            continue;
                        }

                        if (curr[section_type] == null) {
                            this.compositeEventSources.previewAllCourseSection(course_id, section_type);
                        } else {
                            this.compositeEventSources.enrollInCourseSection(course_id, section_type, curr[section_type]);
                        }
                    }
                }
            }

            this.$scope.eventSources = this.compositeEventSources.getEventSources();
        };

        CalendarCtrl.prototype.onEventClick = function (calEvent, jsEvent, view) {
            var section = calEvent.source;
            if (this.scheduleManager.isSectionEnrolled(section)) {
                this.scheduleManager.unenrollSection(section);
            } else {
                this.scheduleManager.enrollSection(section);
            }
        };
        CalendarCtrl.NOT_FOUND = -1;
        CalendarCtrl.StatusEnum = {
            PREVIEWED: 0,
            HIGHLIGHTED: 1,
            SELECTED: 2
        };

        CalendarCtrl.defaultUiConfig = {
            height: 'auto',
            contentHeight: 'auto',
            editable: false,
            header: {
                left: '',
                center: '',
                right: ''
            },
            defaultView: "agendaWeek",
            weekends: false,
            firstDay: 1,
            columnFormat: {
                week: 'dddd'
            },
            allDaySlot: false,
            minTime: '08:00',
            maxTime: '23:00',
            timeFormat: '',
            slotEventOverlap: false
        };

        CalendarCtrl.$inject = [
            '$scope'
        ];
        return CalendarCtrl;
    })();

    
    return CalendarCtrl;
});
//# sourceMappingURL=CalendarCtrl.js.map

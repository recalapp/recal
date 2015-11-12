define(["require", "exports", '../models/CourseEventSources', '../models/CompositeEventSources', '../Utils'], function (require, exports, CourseEventSources, CompositeEventSources, Utils) {
    'use strict';
    var CalendarCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function CalendarCtrl($scope) {
            var _this = this;
            this.$scope = $scope;
            this.courseWatchInitRun = true;
            this.sectionWatchInitRun = true;
            this.calendarWatchInitRun = true;
            this.scheduleManager = this.$scope.$parent.schedule.scheduleManager;
            this.$scope.data = this.scheduleManager.getData();
            this.$scope.calendarID = Utils.idxInList(this.$scope.schedule, this.$scope.schedules);
            this.$scope.myCalendar = $(".calendar").eq(this.$scope.calendarID);
            // calendar event sources dat
            this.compositeEventSources = new CompositeEventSources();
            this.$scope.eventSources = this.compositeEventSources.getEventSources();
            // watch for initializing visible schedule
            this.$scope.$watch(function () {
                return _this.$scope.selectedSchedule;
            }, function (newValue, oldValue) {
                if (newValue == oldValue) {
                    return;
                }
                setTimeout(_this.$scope.myCalendar.fullCalendar('render'), 2000);
            }, true);
            // only initialize config if this schedule is visible
            this.$scope.$watch(function () {
                return _this._isVisible();
            }, function (newValue, oldValue) {
                if (_this.calendarWatchInitRun
                    && newValue == true) {
                    _this.initConfig();
                    _this.calendarWatchInitRun = false;
                }
            });
            this.$scope.$watch(function () {
                return _this.$scope.data.previewCourse;
            }, function (newCourse, oldCourse) {
                return _this.updatePreviewCourse(newCourse, oldCourse);
            }, true);
            // use watchCollection to only watch for addition or removal in the array
            this.$scope.$watchCollection(function () {
                return _this.$scope.data.enrolledCourses;
            }, function (newCourses, oldCourses) {
                return _this.updateEnrolledCourses(newCourses, oldCourses);
            });
            // equality watch for every property
            this.$scope.$watch(function () {
                return _this.$scope.data.enrolledSections;
            }, function (newSections, oldSections) {
                return _this.updateEnrolledSections(newSections, oldSections);
            }, true);
            // watch for calendar to refetch events
            this.$scope.$watch(function () {
                return _this.$scope.eventSources;
            }, function (newEventSources, oldEventSources) {
                _this.$scope.myCalendar.fullCalendar('destroy');
                _this.initConfig();
            }, true);
        }
        CalendarCtrl.prototype._isVisible = function () {
            return this.$scope.myCalendar && this.$scope.myCalendar.is(":visible");
        };
        CalendarCtrl.prototype.initConfig = function () {
            var _this = this;
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
            this.$scope.uiConfig.eventClick = function (calEvent, jsEvent, view) {
                _this.onEventClick(calEvent, jsEvent, view);
                _this.$scope.$apply();
            };
            this.$scope.uiConfig.eventRender = function (event, element) {
                var locationTag = '<div class="fc-location">' + event.location + '</div>';
                element.find(".fc-content").append(locationTag);
                // set tooltip content
                var tooltipConfig = angular.copy(CalendarCtrl.defaultTooltipConfig);
                tooltipConfig.content.text = "enrollments: " + event.enrollment;
                element.qtip(tooltipConfig);
            };
            var options = this.$scope.uiConfig;
            angular.extend(options, {
                eventSources: this.$scope.eventSources
            });
            this.$scope.myCalendar.fullCalendar(options);
        };
        ///////////////////////////////////////////////////////////////////
        // Course Management
        // ////////////////////////////////////////////////////////////////
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
            if (newCourse === oldCourse
                || (newCourse !== null
                    && oldCourse !== null
                    && newCourse.id === oldCourse.id))
                return;
            if (newCourse == null) {
                this.clearPreviewCourse(oldCourse);
            }
            else {
                this.setPreviewCourse(newCourse);
            }
            this.$scope.eventSources = this.compositeEventSources.getEventSources();
        };
        CalendarCtrl.prototype.getRemovedCourse = function (newCourses, oldCourses) {
            var removedIdx = CalendarCtrl.NOT_FOUND;
            for (var i = 0; i < newCourses.length; i++) {
                if (newCourses[i].id !== oldCourses[i].id) {
                    // they are different, meaning oldCourses[i] got removed
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
            // TODO: hack for first run not updating properly
            // without this line, if oldCourses start with a previous courses,
            // it will not get updated
            if (this.courseWatchInitRun && newCourses.length > 0) {
                this.courseWatchInitRun = false;
                for (var i = 0; i < newCourses.length; i++) {
                    this.addCourse(newCourses[i], false);
                }
                return;
            }
            if (newCourses === oldCourses)
                return;
            // course added
            if (newCourses.length == oldCourses.length + 1) {
                var course = newCourses[newCourses.length - 1];
                this.addCourse(course, false);
            }
            else if (newCourses.length == oldCourses.length - 1) {
                var removedCourse = this.getRemovedCourse(newCourses, oldCourses);
                this.removeCourse(removedCourse, false);
            }
            this.$scope.eventSources = this.compositeEventSources.getEventSources();
        };
        ///////////////////////////////////////////////////////
        // Sections
        // ////////////////////////////////////////////////////
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
        // newSections: updated enrollments
        // {
        // course_id: {
        //  section_type: section_id,
        //  section_type: section_id
        // },
        // course_id: {
        // }
        // }
        CalendarCtrl.prototype.updateEnrolledSections = function (newSections, oldSections) {
            var _this = this;
            // check if this is the first run && newSections is not empty
            if (this.sectionWatchInitRun) {
                if (Object.getOwnPropertyNames(newSections).length == 0) {
                    return;
                }
                this.sectionWatchInitRun = false;
                angular.forEach(newSections, function (enrollments, courseId) {
                    // enrollments = { section_type: section_id / null }
                    angular.forEach(enrollments, function (enrolledSectionId, sectionType) {
                        if (enrolledSectionId == null) {
                            _this.compositeEventSources.previewAllCourseSection(courseId, sectionType);
                        }
                        else {
                            _this.compositeEventSources.enrollInCourseSection(courseId, sectionType, enrolledSectionId);
                        }
                    });
                });
                return;
            }
            if (newSections == oldSections) {
                return;
            }
            // return directly if a course has been removed
            // if added, still need to check if any sections are enrolled
            // due to being the only possible section of that type
            if (Object.keys(newSections).length < Object.keys(oldSections).length) {
                return;
            }
            for (var course_id in newSections) {
                // hack to compare jsons, replies on the fact that the order of
                // fields stay the same
                if (JSON.stringify(newSections[course_id]) != JSON.stringify(oldSections[course_id])) {
                    var old = oldSections[course_id];
                    var curr = newSections[course_id];
                    for (var section_type in curr) {
                        if (old != null && curr[section_type] == old[section_type]) {
                            continue;
                        }
                        if (curr[section_type] == null) {
                            this.compositeEventSources.previewAllCourseSection(course_id, section_type);
                        }
                        else {
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
            }
            else {
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
            //slotDuration: '02:00',
            allDaySlot: false,
            minTime: '08:00',
            maxTime: '23:00',
            timeFormat: '',
            slotEventOverlap: false,
        };
        CalendarCtrl.defaultTooltipConfig = {
            content: {
                text: "",
            },
            position: {
                target: 'mouse',
                adjust: {
                    x: 10
                }
            },
            show: {
                solo: true
            },
            hide: {
                event: 'click mouseleave'
            },
            style: {
                classes: "qtip-bootstrap qtip-recal",
                tip: false
            }
        };
        CalendarCtrl.$inject = [
            '$scope',
        ];
        return CalendarCtrl;
    })();
    return CalendarCtrl;
});
//# sourceMappingURL=CalendarCtrl.js.map
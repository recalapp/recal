define(["require", "exports", './SearchCtrl'], function(require, exports, SearchCtrl) {
    'use strict';

    var CourseSearchCtrl = (function () {
        function CourseSearchCtrl($scope, $sce, $filter) {
            var _this = this;
            this.$scope = $scope;
            this.$sce = $sce;
            this.$filter = $filter;
            this.$scope.vm = this;
            this._scheduleManager = this.$scope.$parent.schedule.scheduleManager;
            this.$scope.data = this._scheduleManager.getData();
            this.$scope.filteredCourses = this.$scope.data.courses;

            this.$scope.$watch(function () {
                return _this.$scope.query;
            }, function (newVal, oldVal) {
                if (_this.$scope.whichSearch != SearchCtrl.whichSearchEnum.COURSE_SEARCH) {
                    return;
                }

                _this.search(newVal);
            });

            this.$scope.$watch(function () {
                return _this.$scope.whichSearch;
            }, function (newVal, oldVal) {
                if (newVal == oldVal) {
                    return;
                }

                if (newVal == SearchCtrl.whichSearchEnum.COURSE_SEARCH) {
                    _this.search(_this.$scope.query);
                }
            });

            this.$scope.$watchCollection(function () {
                return _this.$scope.data.enrolledCourses;
            }, function (newVal, oldVal) {
                if (newVal.length == oldVal.length) {
                    return;
                }

                if (_this.$scope.whichSearch != SearchCtrl.whichSearchEnum.COURSE_SEARCH) {
                    return;
                }

                _this.$scope.filteredCourses = _this.$filter("courseSearch")(_this.$scope.data.courses, _this.$scope.query);
            });
        }
        Object.defineProperty(CourseSearchCtrl.prototype, "scheduleManager", {
            get: function () {
                return this._scheduleManager;
            },
            enumerable: true,
            configurable: true
        });

        CourseSearchCtrl.prototype.search = function (query) {
            this._scheduleManager.clearPreviewCourse();

            this.$scope.filteredCourses = this.$filter("courseSearch")(this.$scope.data.courses, query);

            var enrolledLength = this.$scope.data.enrolledCourses.length;
            var searchResultLength = this.$scope.filteredCourses.length;

            this.updateContainerHeight(enrolledLength, searchResultLength);
        };

        CourseSearchCtrl.prototype.onMouseOver = function (course) {
            if (this._scheduleManager.isCourseEnrolled(course)) {
                this._scheduleManager.clearPreviewCourse();
            } else {
                this._scheduleManager.setPreviewCourse(course);
            }
        };

        CourseSearchCtrl.prototype.onMouseLeave = function (course) {
            this._scheduleManager.clearPreviewCourse();
        };

        CourseSearchCtrl.prototype.toggleEnrollment = function (course) {
            if (this._scheduleManager.isCourseEnrolled(course)) {
                this._scheduleManager.unenrollCourse(course);
            } else {
                this._scheduleManager.enrollCourse(course);
            }
        };

        CourseSearchCtrl.prototype.updateContainerHeight = function (numEnrolled, numSearchResults) {
            var THRESHOLD = 10;
            var ENROLLED_CONTAINER_HEIGHT = '20vh';
            var SEARCH_CONTAINER_HEIGHT = '45vh';
            var MAX_HEIGHT = '70vh';

            var enrolledPanelsContainer = $(".enrolled-courses-container :visible")[0];
            var searchPanelsContainer = $(".course-panels-container :visible")[0];

            if (numEnrolled + numSearchResults > THRESHOLD) {
                if (enrolledPanelsContainer && searchPanelsContainer) {
                    enrolledPanelsContainer.style.maxHeight = ENROLLED_CONTAINER_HEIGHT;
                    searchPanelsContainer.style.maxHeight = SEARCH_CONTAINER_HEIGHT;
                } else if (enrolledPanelsContainer) {
                    enrolledPanelsContainer.style.maxHeight = MAX_HEIGHT;
                } else if (searchPanelsContainer) {
                    searchPanelsContainer.style.maxHeight = MAX_HEIGHT;
                }
            } else {
                if (enrolledPanelsContainer) {
                    enrolledPanelsContainer.style.maxHeight = MAX_HEIGHT;
                }
                if (searchPanelsContainer) {
                    searchPanelsContainer.style.maxHeight = MAX_HEIGHT;
                }
            }
        };

        CourseSearchCtrl.prototype.getCourseStyles = function (course) {
            return angular.extend({}, this.getCourseBorderStyle(course), this.getCourseBackgroundAndTextStyle(course));
        };

        CourseSearchCtrl.prototype.getCourseBorderStyle = function (course) {
            return {
                'border-color': course.colors.dark
            };
        };

        CourseSearchCtrl.prototype.getCourseBackgroundAndTextStyle = function (course) {
            return {
                'background-color': course.colors.light,
                'color': course.colors.dark
            };
        };

        CourseSearchCtrl.prototype.isConfirmed = function (course) {
            return this._scheduleManager.isCourseAllSectionsEnrolled(course);
        };

        CourseSearchCtrl.prototype.getLinkColor = function (course) {
            if (course.colors) {
                return course.colors.dark;
            } else {
                return 'blue';
            }
        };
        CourseSearchCtrl.$inject = [
            '$scope',
            '$sce',
            '$filter'
        ];
        return CourseSearchCtrl;
    })();

    
    return CourseSearchCtrl;
});
//# sourceMappingURL=CourseSearchCtrl.js.map

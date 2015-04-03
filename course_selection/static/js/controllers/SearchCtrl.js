define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        function SearchCtrl($scope, $sce, $filter) {
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
                _this._scheduleManager.clearPreviewCourse();

                _this.$scope.filteredCourses = _this.$filter("courseSearch")(_this.$scope.data.courses, newVal);

                var enrolledLength = _this.$scope.data.enrolledCourses.length;
                var searchResultLength = _this.$scope.filteredCourses.length;

                _this.updateContainerHeight(enrolledLength + searchResultLength);
            });

            this.$scope.$watchCollection(function () {
                return _this.$scope.data.enrolledCourses;
            }, function (newVal, oldVal) {
                if (newVal.length == oldVal.length) {
                    return;
                }

                _this.$scope.filteredCourses = _this.$filter("courseSearch")(_this.$scope.data.courses, _this.$scope.query);
            });
        }
        Object.defineProperty(SearchCtrl.prototype, "scheduleManager", {
            get: function () {
                return this._scheduleManager;
            },
            enumerable: true,
            configurable: true
        });

        SearchCtrl.prototype.onMouseOver = function (course) {
            if (this._scheduleManager.isCourseEnrolled(course)) {
                this._scheduleManager.clearPreviewCourse();
            } else {
                this._scheduleManager.setPreviewCourse(course);
            }
        };

        SearchCtrl.prototype.onMouseLeave = function (course) {
            this._scheduleManager.clearPreviewCourse();
        };

        SearchCtrl.prototype.toggleEnrollment = function (course) {
            if (this._scheduleManager.isCourseEnrolled(course)) {
                this._scheduleManager.unenrollCourse(course);
            } else {
                this._scheduleManager.enrollCourse(course);
            }
        };

        SearchCtrl.prototype.updateContainerHeight = function (numOfDisplayedCourses) {
            var THRESHOLD = 10;
            var ENROLLED_CONTAINER_HEIGHT = '20vh';
            var SEARCH_CONTAINER_HEIGHT = '45vh';
            var MAX_HEIGHT = '80vh';

            var enrolledPanelsContainer = $(".enrolled-courses-container :visible")[0];
            var searchPanelsContainer = $(".course-panels-container :visible")[0];

            if (numOfDisplayedCourses > THRESHOLD) {
                if (enrolledPanelsContainer) {
                    enrolledPanelsContainer.style.maxHeight = ENROLLED_CONTAINER_HEIGHT;
                }
                if (searchPanelsContainer) {
                    searchPanelsContainer.style.maxHeight = SEARCH_CONTAINER_HEIGHT;
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

        SearchCtrl.prototype.getCourseStyles = function (course) {
            return angular.extend({}, this.getCourseBorderStyle(course), this.getCourseBackgroundAndTextStyle(course));
        };

        SearchCtrl.prototype.getCourseBorderStyle = function (course) {
            return {
                'border-color': course.colors.dark
            };
        };

        SearchCtrl.prototype.getCourseBackgroundAndTextStyle = function (course) {
            return {
                'background-color': course.colors.light,
                'color': course.colors.dark
            };
        };

        SearchCtrl.prototype.isConfirmed = function (course) {
            return this._scheduleManager.isCourseAllSectionsEnrolled(course);
        };

        SearchCtrl.prototype.getLinkColor = function (course) {
            if (course.colors) {
                return course.colors.dark;
            } else {
                return 'blue';
            }
        };
        SearchCtrl.$inject = [
            '$scope',
            '$sce',
            '$filter'
        ];

        SearchCtrl.NOT_FOUND = -1;
        return SearchCtrl;
    })();

    
    return SearchCtrl;
});
//# sourceMappingURL=SearchCtrl.js.map

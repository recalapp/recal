/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        function SearchCtrl($scope, $sce) {
            this.$scope = $scope;
            this.$sce = $sce;
            this.$scope.vm = this;
            this.courseManager = this.$scope.$parent.schedule.courseManager;
            this.$scope.data = this.courseManager.getData();
        }
        SearchCtrl.prototype.queryOnChange = function () {
            this.courseManager.clearPreviewCourse();
        };

        // if user is not enrolled in course yet, add course events to previewEvents
        // else, don't do anything
        SearchCtrl.prototype.onMouseOver = function (course) {
            if (this.courseManager.isCourseEnrolled(course)) {
                this.courseManager.clearPreviewCourse();
            } else {
                this.courseManager.setPreviewCourse(course);
            }
        };

        // clear preview course on mouse leave
        SearchCtrl.prototype.onMouseLeave = function (course) {
            this.courseManager.clearPreviewCourse();
        };

        SearchCtrl.prototype.enrolledOnMouseOver = function (course) {
        };

        // toggle enrollment of course
        SearchCtrl.prototype.toggleEnrollment = function (course) {
            if (this.courseManager.isCourseEnrolled(course)) {
                this.courseManager.unenrollCourse(course);
            } else {
                this.courseManager.enrollCourse(course);
            }
        };

        SearchCtrl.prototype.getStyles = function (course) {
            return angular.extend({}, this.getBorderStyle(course), this.getBackgroundAndTextStyle(course));
        };

        SearchCtrl.prototype.getBorderStyle = function (course) {
            return {
                'border-color': course.colors.dark
            };
        };

        SearchCtrl.prototype.getBackgroundAndTextStyle = function (course) {
            return {
                'background-color': course.colors.light,
                'color': course.colors.dark
            };
        };

        SearchCtrl.prototype.isConfirmed = function (course) {
            return this.courseManager.isCourseAllSectionsEnrolled(course);
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
            '$sce'
        ];

        SearchCtrl.NOT_FOUND = -1;
        return SearchCtrl;
    })();

    
    return SearchCtrl;
});

/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        function SearchCtrl($scope, $sce) {
            this.$scope = $scope;
            this.$sce = $sce;
            this.$scope.vm = this;
            this.scheduleManager = this.$scope.$parent.schedule.scheduleManager;
            this.$scope.data = this.scheduleManager.getData();
        }
        SearchCtrl.prototype.queryOnChange = function () {
            this.scheduleManager.clearPreviewCourse();
        };

        /*
        private _initState() {
        this.$scope.state = "loading";
        this.$scope.$watch(() => {
        return this.$scope.data.courses;
        }, () => {
        if (this.$scope.data.courses.length == 0) {
        this.$scope.state = "loading";
        };
        });
        }
        */
        // if user is not enrolled in course yet, add course events to previewEvents
        // else, don't do anything
        SearchCtrl.prototype.onMouseOver = function (course) {
            if (this.scheduleManager.isCourseEnrolled(course)) {
                this.scheduleManager.clearPreviewCourse();
            } else {
                this.scheduleManager.setPreviewCourse(course);
            }
        };

        // clear preview course on mouse leave
        SearchCtrl.prototype.onMouseLeave = function (course) {
            this.scheduleManager.clearPreviewCourse();
        };

        SearchCtrl.prototype.enrolledOnMouseOver = function (course) {
        };

        // toggle enrollment of course
        SearchCtrl.prototype.toggleEnrollment = function (course) {
            if (this.scheduleManager.isCourseEnrolled(course)) {
                this.scheduleManager.unenrollCourse(course);
            } else {
                this.scheduleManager.enrollCourse(course);
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
            return this.scheduleManager.isCourseAllSectionsEnrolled(course);
        };

        // TODO: this function no longer works due to course.colors never being null
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

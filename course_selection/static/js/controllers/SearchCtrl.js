/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        function SearchCtrl($scope, $sce, courseResource) {
            this.$scope = $scope;
            this.$sce = $sce;
            this.courseResource = courseResource;
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

        // toggle enrollment of course
        SearchCtrl.prototype.onClick = function (course) {
            if (this.courseManager.isCourseEnrolled(course)) {
                this.courseManager.unenrollCourse(course);
            } else {
                this.courseManager.enrollCourse(course);
            }
        };

        SearchCtrl.prototype.setColor = function (course) {
            if (course.colors == null) {
                return {};
            } else {
                var backgroundColor;
                var textColor;
                if (this.courseManager.isCourseAllSectionsEnrolled(course)) {
                    backgroundColor = course.colors.dark;
                    textColor = 'white';
                } else {
                    backgroundColor = course.colors.light;
                    textColor = course.colors.dark;
                }

                return {
                    'background-color': backgroundColor,
                    'color': textColor
                };
            }
        };

        SearchCtrl.prototype.getEasyPceLink = function (course) {
            var color = this.setColor(course).color;
            var link = "http://easypce.com/courses/" + course.primary_listing;
            return this.$sce.trustAsHtml("<a target='_blank' href='" + link + "'" + "style='color: " + color + "'" + ">" + course.rating + "</a>");
        };
        SearchCtrl.$inject = [
            '$scope',
            '$sce',
            'CourseResource'
        ];

        SearchCtrl.NOT_FOUND = -1;
        return SearchCtrl;
    })();

    
    return SearchCtrl;
});

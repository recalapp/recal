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
        // if user is not enrolled in course yet, add course events to previewEvents
        // else, don't do anything
        SearchCtrl.prototype.onMouseOver = function (course) {
            if (this.courseManager.isCourseEnrolled(course)) {
                this.courseManager.clearPreviewCourse();
            } else {
                this.courseManager.setPreviewCourse(course);
            }
        };

        // TODO: what if course.id != previewCourse.id? will it ever be out of sync?
        SearchCtrl.prototype.onMouseLeave = function (course) {
            this.courseManager.clearPreviewCourse();
        };

        // TODO: what if user removes serach string => no more search results?
        // currently results in preview course being sticky
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
                return {
                    'background-color': course.colors.dark,
                    'color': 'white'
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

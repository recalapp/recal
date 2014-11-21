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
        SearchCtrl.prototype.onMouseOver = function (course) {
            if (this.courseManager.isCourseEnrolled(course)) {
                this.courseManager.clearPreviewCourse();
            } else {
                this.courseManager.setPreviewCourse(course);
            }
        };

        SearchCtrl.prototype.onMouseLeave = function (course) {
            this.courseManager.clearPreviewCourse();
        };

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
//# sourceMappingURL=SearchCtrl.js.map

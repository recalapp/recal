define(["require", "exports"], function (require, exports) {
    'use strict';
    var CoursePanel = (function () {
        function CoursePanel() {
        }
        CoursePanel.link = function (scope, element, attrs) {
            var scheduleManager;
            var course;
            element.on('click', function () {
            });
            element.on('mouseover', function () {
                CoursePanel.onMouseOver(course, scheduleManager);
            });
            element.on('mouseleave', function () {
                CoursePanel.onMouseLeave(course, scheduleManager);
            });
            element.on('blur', function () {
            });
            element.on('$destroy', function () {
            });
        };
        CoursePanel.onMouseLeave = function (course, scheduleManager) {
            scheduleManager.clearPreviewCourse();
        };
        CoursePanel.onMouseOver = function (course, scheduleManager) {
            if (scheduleManager.isCourseEnrolled(course)) {
                scheduleManager.clearPreviewCourse();
            }
            else {
                scheduleManager.setPreviewCourse(course);
            }
        };
        CoursePanel.get = function () {
            return {
                restrict: CoursePanel.restrict,
                link: CoursePanel.link,
                scope: CoursePanel.scope,
                templateUrl: CoursePanel.templateUrl
            };
        };
        CoursePanel.restrict = 'E';
        CoursePanel.scope = {
            course: '=',
            scheduleManager: '-',
        };
        CoursePanel.templateUrl = '/static/templates/coursePanelDirective.html';
        return CoursePanel;
    })();
    return CoursePanel;
});

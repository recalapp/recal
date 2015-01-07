import Module = require('../Module');
var niceDirectives = new Module('niceDirectives', []);

import IScheduleManager = require('../interfaces/IScheduleManager');
import ICourse = require('../interfaces/ICourse');

niceDirectives.addDirective('selectOnClick', [function() {
    return {
        restrict: 'A',
        link(scope, element) {
            var focusedElement;
            element.on('click', function () {
                if (focusedElement != this) {
                    this.select();
                    focusedElement = this;
                }
            });
            element.on('blur', function () {
                focusedElement = null;
            });
        }
    }
}]);

// TODO: this is not really autofocus; still requires focus="true" in the html
niceDirectives.addDirective('autoFocus', ['$timeout', ($timeout) => {
    return {
        scope : {
            trigger : '@focus'
        },
        link : (scope, element) => {
            scope.$watch('trigger', (trigger) => {
                if (trigger) {
                    $timeout(() => {
                        element[0].focus();
                    });
                }
            });
        }
    };
}]);

niceDirectives.addDirective('coursePanel', [function() {
    return {
        restrict: 'E',
        link: (scope, element, attrs) => {
            var scheduleManager: IScheduleManager;
            var course: ICourse;

            function onMouseLeave() {
                scheduleManager.clearPreviewCourse();
            }

            function onMouseOver() {
                if (scheduleManager.isCourseEnrolled(course)) {
                    scheduleManager.clearPreviewCourse();
                } else {
                    scheduleManager.setPreviewCourse(course);
                }
            }

            element.on('click', () => {
            });

            element.on('mouseover', () => {
                onMouseOver();
            });

            element.on('mouseleave', () => {
                onMouseLeave();
            });

            element.on('blur', () => {
            });

            element.on('$destroy', () => {
            });
        },
        scope: {
            course: '=',
            scheduleManager: '=',
        },
        templateUrl: '/static/templates/coursePanelDirective.html'
    }
}]);

export = niceDirectives;

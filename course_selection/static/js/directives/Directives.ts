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

/****
 * Got this from the Internet: http://plnkr.co/edit/v6bqqe?p=info
 */
niceDirectives.addDirective("qtip", [function () {

    return {
        restrict: 'A',
        link: (scope, element, attrs) => {

            var text = () => {
                return element.attr('content') || null;
            } 

            var title = () => {
                return element.attr('qtip-title') || null;
            }

            var my = element.attr('my') || 'bottom left';
            var at = element.attr('at') || 'top right';
            var target = element.attr('target') ||  "event";
            scope.qtipSkin = (attrs.skin ? "qtip-" + attrs.skin : "qtip");

            element.qtip({
                content: {
                    text: text,
                    title: title
                },

                style: {
                    classes: scope.qtipSkin + " qtip-rounded qtip-shadow "
                },
                show: {
                    event: 'click mouseover',
                    solo: true
                },
                hide: {
                    event: (scope.closeButton == true ? "false" : "click mouseleave"),
                    delay: 100,
                    fixed: (($(this).hover || attrs.fixed) ? true : false),  //prevent the tooltip from hiding when set to true
                    leave: false
                },
                position: {
                    viewport: $(window),// Keep it on-screen at all times if possible
                    target: target,
                    my: my,
                    at: at
                }
            });

            scope.$on("$destroy", function () {
                $(element).qtip('destroy', true); // Immediately destroy all tooltips belonging to the selected elements
            });

            $('[my-qtip2]').css("display", "inline-block");
        }
    }
}]);

export = niceDirectives;

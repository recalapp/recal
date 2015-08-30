define(["require", "exports", '../Module'], function (require, exports, Module) {
    var niceDirectives = new Module('niceDirectives', []);
    niceDirectives.addDirective('selectOnClick', [function () {
            return {
                restrict: 'A',
                link: function (scope, element) {
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
            };
        }]);
    niceDirectives.addDirective('autoFocus', ['$timeout', function ($timeout) {
            return {
                scope: {
                    trigger: '@focus'
                },
                link: function (scope, element) {
                    scope.$watch('trigger', function (trigger) {
                        if (trigger) {
                            $timeout(function () {
                                element[0].focus();
                            });
                        }
                    });
                }
            };
        }]);
    niceDirectives.addDirective('coursePanel', [function () {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    var scheduleManager;
                    var course;
                    function onMouseLeave() {
                        scheduleManager.clearPreviewCourse();
                    }
                    function onMouseOver() {
                        if (scheduleManager.isCourseEnrolled(course)) {
                            scheduleManager.clearPreviewCourse();
                        }
                        else {
                            scheduleManager.setPreviewCourse(course);
                        }
                    }
                    element.on('click', function () {
                    });
                    element.on('mouseover', function () {
                        onMouseOver();
                    });
                    element.on('mouseleave', function () {
                        onMouseLeave();
                    });
                    element.on('blur', function () {
                    });
                    element.on('$destroy', function () {
                    });
                },
                scope: {
                    course: '=',
                    scheduleManager: '=',
                },
                templateUrl: '/static/templates/coursePanelDirective.html'
            };
        }]);
    niceDirectives.addDirective("qtip", [function () {
            var _this = this;
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var text = function () {
                        return element.attr('content') || null;
                    };
                    var title = function () {
                        return element.attr('qtip-title') || null;
                    };
                    var my = element.attr('my') || 'bottom left';
                    var at = element.attr('at') || 'top right';
                    var target = element.attr('target') || "event";
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
                            fixed: (($(_this).hover || attrs.fixed) ? true : false),
                            leave: false
                        },
                        position: {
                            viewport: $(window),
                            target: target,
                            my: my,
                            at: at
                        }
                    });
                    scope.$on("$destroy", function () {
                    });
                    $('[my-qtip2]').css("display", "inline-block");
                }
            };
        }]);
    return niceDirectives;
});

import IScheduleManager = require('../interfaces/IScheduleManager');
import ICourse = require('../interfaces/ICourse');

'use strict';

class CoursePanel {
    public static restrict = 'E';
    public static link(scope, element, attrs) {
        var scheduleManager: IScheduleManager;
        var course: ICourse;

        element.on('click', () => {
        });

        element.on('mouseover', () => {
            CoursePanel.onMouseOver(course, scheduleManager);
        });

        element.on('mouseleave', () => {
            CoursePanel.onMouseLeave(course, scheduleManager);
        });

        element.on('blur', () => {
        });

        element.on('$destroy', () => {
        });
    }

    public static onMouseLeave(course, scheduleManager) {
        scheduleManager.clearPreviewCourse();
    }

    public static onMouseOver(course, scheduleManager) {
        if (scheduleManager.isCourseEnrolled(course)) {
            scheduleManager.clearPreviewCourse();
        } else {
            scheduleManager.setPreviewCourse(course);
        }
    }

    public static scope = {
        course: '=',
        scheduleManager: '-',
    };


    public static templateUrl = '/static/templates/coursePanelDirective.html';

    public static get() {
        return {
            restrict: CoursePanel.restrict,
            link: CoursePanel.link,
            scope: CoursePanel.scope,
            templateUrl: CoursePanel.templateUrl
        };
    }
}

export = CoursePanel;

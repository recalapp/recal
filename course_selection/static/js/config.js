/// <reference path="../ts/typings/tsd.d.ts" />
function staticPath(path) {
    return '../' + path;
}
function bowerPath(path) {
    return staticPath('course_selection/bower_components/' + path);
}
require.config({
    paths: {
        /* this is flatstrap */
        'flatstrap': bowerPath('flatstrap/dist/js/flatstrap.min'),
        'fullcalendar': bowerPath('fullcalendar/dist/fullcalendar.min'),
        'jquery': bowerPath('jquery/jquery.min'),
        'jquery.cookie': bowerPath('jquery.cookie/jquery.cookie'),
        'jqueryui': bowerPath('jquery-ui/jquery-ui.min'),
        'moment': bowerPath('moment/min/moment.min'),
        'moment-timezone': bowerPath('moment-timezone/builds/moment-timezone-with-data'),
        'angular': bowerPath('angular/angular'),
        'angular-animate': bowerPath('angular-animate/angular-animate.min'),
        'angular-resource': bowerPath('angular-resource/angular-resource.min'),
        // 'angular-ui-calendar': bowerPath('angular-ui-calendar/src/calendar'),
        'angular-bootstrap': bowerPath('angular-bootstrap/ui-bootstrap-tpls.min'),
        'angular-local-storage': bowerPath('angular-local-storage/dist/angular-local-storage.min'),
        'angular-aria': bowerPath('angular-aria/angular-aria.min'),
        'angular-material': bowerPath('angular-material/angular-material.min'),
        'angular-hotkeys': bowerPath('angular-hotkeys/build/hotkeys.min'),
        'angular-loading-bar': bowerPath('angular-loading-bar/build/loading-bar'),
        'qtip': bowerPath('qtip2/jquery.qtip.min'),
        /* 'chai': bowerPath('chai/chai'), */
        'text': bowerPath('requirejs-text/text')
    },
    shim: {
        'flatstrap': ['jquery'],
        'fullcalendar': ['jqueryui'],
        'angular': { exports: 'angular', dep: ['jquery'] },
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        'angular-material': ['angular'],
        'angular-resource': ['angular'],
        // 'angular-ui-calendar': ['angular'],
        'angular-bootstrap': ['angular'],
        'angularRoute': ['angular'],
        'angular-hotkeys': ['angular'],
        'angular-local-storage': ['angular'],
        'angular-loading-bar': ['angular'],
    },
    priority: [
        "angular"
    ]
});
require(['angular',
    'angular-animate',
    'angular-local-storage',
    'angular-hotkeys',
    'angular-aria',
    'angular-material',
    'angular-loading-bar',
    'angular-resource',
    'moment',
    /* 'chai', */
    'fullcalendar',
    // 'angular-ui-calendar',
    'angular-bootstrap',
    'Application',
    'controllers/Controllers',
    'filters/Filters',
    'services/Services',
    'directives/Directives',
    'jquery',
    'qtip',
    'flatstrap'
], function (angular) {
    angular.bootstrap(document, ['nice']);
});
// TypeScript declarations useful for importing angular modules
/*
declare module 'angular' {
    var angular: ng.IAngularStatic;
    export = angular;
}
*/
//# sourceMappingURL=config.js.map
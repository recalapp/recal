/// <reference path="../ts/typings/tsd.d.ts" />
function staticPath(path) {
    return "/static/" + path;
}
function appPath(path) {
    return "../js/" + path;
}
require.config({
    baseUrl: staticPath("bower_components/"),
    paths: {
        'flatstrap': 'flatstrap/dist/js/flatstrap.min',
        'fullcalendar': 'fullcalendar/dist/fullcalendar.min',
        'jquery': 'jquery/jquery.min',
        'jquery.cookie': 'jquery.cookie/jquery.cookie',
        'jqueryui': 'jquery-ui/jquery-ui.min',
        'moment': 'moment/min/moment.min',
        'moment-timezone': 'moment-timezone/builds/moment-timezone-with-data',
        'angular': 'angular/angular',
        'angular-animate': 'angular-animate/angular-animate.min',
        'angular-resource': 'angular-resource/angular-resource.min',
        'angular-bootstrap': 'angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-local-storage': 'angular-local-storage/dist/angular-local-storage.min',
        'angular-aria': 'angular-aria/angular-aria.min',
        'angular-material': 'angular-material/angular-material.min',
        'angular-hotkeys': 'angular-hotkeys/build/hotkeys.min',
        'angular-loading-bar': 'angular-loading-bar/build/loading-bar',
        'qtip': 'qtip2/jquery.qtip.min',
        'text': 'requirejs-text/text'
    },
    shim: {
        'flatstrap': ['jquery'],
        'fullcalendar': ['jqueryui'],
        'angular': { exports: 'angular', dep: ['jquery'] },
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        'angular-material': ['angular'],
        'angular-resource': ['angular'],
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
    'fullcalendar',
    'angular-bootstrap',
    appPath('Application'),
    appPath('controllers/Controllers'),
    appPath('filters/Filters'),
    appPath('services/Services'),
    appPath('directives/Directives'),
    'jquery',
    'qtip',
    'flatstrap'
], function (angular) {
    angular.bootstrap(document, ['nice']);
});

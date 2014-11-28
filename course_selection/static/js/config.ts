/// <reference path="../../../nice/static/ts/typings/tsd.d.ts" />

function staticPath(path: String): String
{
    return '../' + path;
}

function bowerPath(path: String): String
{
    return staticPath('bower_components/' + path);
}

require.config({
    paths: {
        bootstrap: bowerPath('bootstrap/dist/js/bootstrap.min'),
        fullcalendar: bowerPath('fullcalendar/dist/fullcalendar.min'),
        jquery: bowerPath('jquery/dist/jquery.min'),
        'jquery.cookie': bowerPath('jquery.cookie/jquery.cookie'),
        jqueryui: bowerPath('jquery-ui/jquery-ui.min'),
        moment: bowerPath('momentjs/min/moment.min'),
        'moment-timezone': bowerPath('moment-timezone/builds/moment-timezone-with-data'),
        'angular': bowerPath('angular/angular.min'),
        'angular-animate': bowerPath('angular-animate/angular-animate.min'),
        'angular-resource': bowerPath('angular-resource/angular-resource.min'),
        'angular-ui-calendar': bowerPath('angular-ui-calendar/src/calendar'),
        'angular-bootstrap': bowerPath('angular-bootstrap/ui-bootstrap-tpls.min'),
        'angular-local-storage': bowerPath('angular-local-storage/dist/angular-local-storage.min'),
        'angular-loading-bar': bowerPath('angular-loading-bar/build/loading-bar'),
        'chai': bowerPath('chai/chai')
    },
    shim: {
        bootstrap: ['jquery'],
        fullcalendar: ['jqueryui'],
        'angular': { exports: 'angular', dep: ['jquery'] },
        'angular-animate': ['angular'],
        'angular-resource': ['angular'],
        'angular-ui-calendar': ['angular'],
        'angular-bootstrap': ['angular'],
        'angularRoute': ['angular'],
        'angular-local-storage': ['angular'],
        'angular-loading-bar': ['angular'],
        'chai': []
    },
    priority: [
		"angular"
	]
});

require(['angular', 
        'angular-animate',
        'angular-local-storage',
        'angular-loading-bar', 
        'angular-resource', 
        'moment',
        'chai',
        'fullcalendar',
        'angular-ui-calendar', 
        'angular-bootstrap', 
        'Application', 
        'controllers/Controllers',
        'filters/Filters',
        'services/Services',
        'jquery',
        'bootstrap',
        ], function (angular) {
    angular.bootstrap(document, ['nice']);
});

// TypeScript declarations useful for importing angular modules
declare module 'angular' {
    var angular: ng.IAngularStatic;
    export = angular;
}

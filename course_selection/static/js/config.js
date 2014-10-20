/// <reference path="../../../nice/static/ts/typings/tsd.d.ts" />
function staticPath(path) {
    return '../' + path;
}

function bowerPath(path) {
    return staticPath('bower_components/' + path);
}

require.config({
    paths: {
        bootstrap: bowerPath('bootstrap/dist/js/bootstrap'),
        fullcalendar: bowerPath('fullcalendar/dist/fullcalendar'),
        jquery: bowerPath('jquery/dist/jquery'),
        jqueryui: bowerPath('jquery-ui/jquery-ui'),
        moment: bowerPath('momentjs/moment'),
        'moment-timezone': bowerPath('moment-timezone/builds/moment-timezone-with-data'),
        'angular': bowerPath('angular/angular'),
        'angular-resource': bowerPath('angular-resource/angular-resource')
    },
    shim: {
        bootstrap: ['jquery'],
        fullcalendar: ['jqueryui'],
        'angular': { exports: 'angular', dep: ['jquery'] },
        'angular-resource': ['angular'],
        'angularRoute': ['angular']
    },
    priority: [
        "angular"
    ]
});

require([
    'angular',
    'angular-resource',
    'Application',
    'controllers/SearchCtrl',
    'jquery',
    'bootstrap'
], function (angular) {
    angular.bootstrap(document, ['nice']);
});


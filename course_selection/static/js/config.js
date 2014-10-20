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
        'angular': bowerPath('angular/angular')
    },
    shim: {
        bootstrap: ['jquery'],
        fullcalendar: ['jqueryui'],
        'angular': { exports: 'angular', dep: ['jquery'] },
        'angularRoute': ['angular']
    },
    priority: [
        "angular"
    ]
});

require(['angular', 'Application', 'controllers/SearchCtrl', 'services/CourseStorage'], function (angular) {
    angular.bootstrap(document, ['nice']);
});


/// <reference path="../../typings/tsd.d.ts" />
function staticPath(path) {
    return '../../../' + path;
}

function bowerPath(path) {
    return staticPath('bower_components/' + path);
}

require.config({
    paths: {
        bootstrap: bowerPath('bootstrap/dist/js/bootstrap'),
        'bootstrap-datepicker': bowerPath('smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker'),
        dashboard: staticPath('compiled/dashboard'),
        fullcalendar: bowerPath('fullcalendar/fullcalendar'),
        jeditable: bowerPath('jquery_jeditable/jquery.jeditable'),
        jquery: bowerPath('jquery/dist/jquery'),
        jqueryui: bowerPath('jquery-ui/jquery-ui'),
        'jquery.cookie': bowerPath('jquery.cookie/jquery.cookie'),
        moment: bowerPath('momentjs/moment'),
        'moment-timezone': bowerPath('moment-timezone/builds/moment-timezone-with-data')
    },
    shim: {
        bootstrap: ['jquery'],
        'bootstrap-datepicker': ['bootstrap'],
        dashboard: ['bootstrap', 'bootstrap-datepicker', 'fullcalendar', 'jquery', 'jqueryui', 'jquery.cookie', 'moment-timezone'],
        fullcalendar: ['jqueryui'],
        jeditable: ['jquery']
    }
});

require(['dashboard']);
require(['./main']);

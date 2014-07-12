/// <reference path="../typings/tsd.d.ts" />
function staticPath(path) {
    return '../../' + path;
}

function bowerPath(path) {
    return staticPath('bower_components/' + path);
}

require.config({
    paths: {
        bootstrap: bowerPath('bootstrap/dist/js/bootstrap'),
        jeditable: bowerPath('jquery_jeditable/jquery.jeditable'),
        jquery: bowerPath('jquery/dist/jquery'),
        jqueryui: bowerPath('jquery-ui/jquery-ui')
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        jeditable: {
            deps: ['jquery']
        },
        jquery: {
            exports: '$'
        },
        jqueryui: {
            deps: ['jquery'],
            exports: '$'
        }
    }
});

require(['main']);

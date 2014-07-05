/// <reference path="../typings/tsd.d.ts" />
function staticPath(path) {
    return '../../' + path;
}

function bowerPath(path) {
    return staticPath('bower_components/' + path);
}

require.config({
    paths: {
        jquery: bowerPath('jquery/dist/jquery'),
        bootstrap: bowerPath('bootstrap/dist/js/bootstrap'),
        jqueryui: bowerPath('jqueryui/ui/jquery-ui')
    },
    shim: {
        jquery: {
            exports: '$'
        },
        bootstrap: {
            deps: ['jquery']
        },
        jqueryui: {
            deps: ['jquery'],
            exports: '$'
        }
    }
});

require(['bootstrap', 'jqueryui']);

require(['main']);

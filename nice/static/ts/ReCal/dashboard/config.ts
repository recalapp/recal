/// <reference path="../../typings/tsd.d.ts" />

function staticPath(path: String): String
{
    return '../../../' + path;
}

function bowerPath(path: String): String
{
    return staticPath('bower_components/' + path);
}

require.config({
    paths: {
        bootstrap: bowerPath('bootstrap/dist/js/bootstrap'),
        jeditable: bowerPath('jquery_jeditable/jquery.jeditable'),
        jquery: bowerPath('jquery/dist/jquery'),
        jqueryui: bowerPath('jquery-ui/jquery-ui'),
        moment: bowerPath('momentjs/moment'),
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
        },
        jeditable: {
            deps: ['jquery'],
        },
        jquery: {
        },
        jqueryui: {
            deps: ['jquery'],
        },
        moment: {
        },
    }
});

require(['main']);

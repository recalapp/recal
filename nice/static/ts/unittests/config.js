/// <reference path="../typings/tsd.d.ts" />
require.config({
    baseUrl: '../../bower_components',
    paths: {
        jquery: 'jquery/dist/jquery'
    }
});

require(['main']);

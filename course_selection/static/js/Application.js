/// <reference path='../../../nice/static/ts/typings/tsd.d.ts' />
/// <amd-dependency path="angular"/>
define(["require", "exports", './controllers/SearchCtrl', "angular"], function(require, exports, SearchCtrl) {
    'use strict';

    var nice = angular.module('nice', ['ngResource']).controller('SearchCtrl', SearchCtrl).config(function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    });

    
    return nice;
});

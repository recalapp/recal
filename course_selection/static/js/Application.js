/// <reference path='../../../nice/static/ts/typings/tsd.d.ts' />
/// <amd-dependency path="angular"/>
define(["require", "exports", "angular"], function(require, exports) {
    'use strict';

    var nice = angular.module('nice', []).config(function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    });

    
    return nice;
});

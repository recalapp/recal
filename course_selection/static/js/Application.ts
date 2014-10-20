/// <reference path='../../../nice/static/ts/typings/tsd.d.ts' />
/// <amd-dependency path="angular"/>

import SearchCtrl = require('./controllers/SearchCtrl');

'use strict';

var nice = angular.module('nice', ['ngResource'])
    .controller('SearchCtrl', SearchCtrl)
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    })
    // .config(function ($resourceProvider) {
    //    $resourceProvider.defaults.stripTrailingSlashes = false;
    //  });

export = nice;

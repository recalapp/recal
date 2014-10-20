/// <reference path='../../../nice/static/ts/typings/tsd.d.ts' />
/// <amd-dependency path="angular"/>

import SearchCtrl = require('./controllers/SearchCtrl');
import CourseStorage = require('./services/CourseStorage');

'use strict';

var nice = angular.module('nice', [])
.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});

export = nice;

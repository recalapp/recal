import Module = require('./Module');

var nice = new Module('nice', [
        'ngResource',
        'ui.calendar',
        'ui.bootstrap',
        'LocalStorageModule',
        'niceServices',
        'niceFilters', 
        'niceControllers'
        ]);

export = nice;

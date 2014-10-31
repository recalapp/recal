import Module = require('./Module');

var nice = new Module('nice', [
        'ngResource',
        'ui.calendar',
        'ui.bootstrap',
        'LocalStorageModule',
        'niceFilters', 
        'niceServices',
        'niceControllers'
        ]);

export = nice;

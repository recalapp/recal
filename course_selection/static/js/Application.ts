import Module = require('./Module');

var nice = new Module('nice', [
        'ngResource',
        'ui.calendar',
        'ui.bootstrap',
        'niceFilters', 
        'niceControllers',
        'niceServices']);

export = nice;

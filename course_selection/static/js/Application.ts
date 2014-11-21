import Module = require('./Module');

var nice = new Module('nice', [
        'ngResource',
        'angular-loading-bar',
        'ngAnimate',
        'ui.calendar',
        'ui.bootstrap',
        'LocalStorageModule',
        'niceServices',
        'niceFilters', 
        'niceControllers'
        ]);

nice.app.config((localStorageServiceProvider) => {
  localStorageServiceProvider
    .setPrefix('nice');
});

export = nice;

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
        'niceControllers',
        'niceDirectives'
        ]);

nice.app.config((localStorageServiceProvider) => {
  localStorageServiceProvider.setPrefix('nice');
}).config((cfpLoadingBarProvider) => {
    cfpLoadingBarProvider.latencyThreshold = 500;
}).config(($resourceProvider) => {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});

export = nice;

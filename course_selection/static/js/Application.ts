import Module = require('./Module');

var nice = new Module('nice', [
        'ngResource',
        'angular-loading-bar',
        'ngAnimate',
        //'ui.calendar',
        'ui.bootstrap',
        'cfp.hotkeys',
        'LocalStorageModule',
        'niceServices',
        'niceFilters',
        'niceControllers',
        'niceDirectives'
        ]);

nice.app.config((localStorageServiceProvider) => {
    localStorageServiceProvider.setPrefix('nice');
    localStorageServiceProvider.setStorageType('sessionStorage');
})
.config((cfpLoadingBarProvider) => {
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.includeSpinner = false;
})
.config(($resourceProvider) => {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});

export = nice;

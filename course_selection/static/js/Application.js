define(["require", "exports", './Module'], function(require, exports, Module) {
    var nice = new Module('nice', [
        'ngResource',
        'angular-loading-bar',
        'ngAnimate',
        'ui.calendar',
        'ui.bootstrap',
        'cfp.hotkeys',
        'LocalStorageModule',
        'niceServices',
        'niceFilters',
        'niceControllers',
        'niceDirectives'
    ]);

    nice.app.config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('nice');
        localStorageServiceProvider.setStorageType('sessionStorage');
    }).config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.includeSpinner = false;
    }).config(function ($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    });

    
    return nice;
});

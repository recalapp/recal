import Module = require('./Module');

var nice = new Module('nice', [
        'ngResource',
        'angular-loading-bar',
        'ngAnimate',
        //'ui.calendar',
        'ui.bootstrap',
        'ngAria',
        'ngMaterial',
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
})
.config(($animateProvider) => {
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
})
.config(($mdThemingProvider) => {
    // TODO: configure the theme
    $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink');
});

export = nice;

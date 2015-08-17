define(["require", "exports", './Module'], function (require, exports, Module) {
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
    nice.app.config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('nice');
        localStorageServiceProvider.setStorageType('sessionStorage');
    })
        .config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.includeSpinner = false;
    })
        .config(function ($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    })
        .config(function ($animateProvider) {
        $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
    });
    return nice;
});
//# sourceMappingURL=Application.js.map
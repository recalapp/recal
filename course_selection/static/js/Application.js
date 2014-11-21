define(["require", "exports", './Module'], function(require, exports, Module) {
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

    nice.app.config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('nice');
    });

    
    return nice;
});

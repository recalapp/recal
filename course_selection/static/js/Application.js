define(["require", "exports", './Module'], function(require, exports, Module) {
    var nice = new Module('nice', [
        'ngResource',
        'ui.calendar',
        'ui.bootstrap',
        'LocalStorageModule',
        'niceServices',
        'niceFilters',
        'niceControllers'
    ]);

    
    return nice;
});
//# sourceMappingURL=Application.js.map

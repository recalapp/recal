define(["require", "exports", './Module'], function(require, exports, Module) {
    var nice = new Module('nice', [
        'ngResource',
        'ui.calendar',
        'ui.bootstrap',
        'niceFilters',
        'niceControllers',
        'niceServices']);

    
    return nice;
});

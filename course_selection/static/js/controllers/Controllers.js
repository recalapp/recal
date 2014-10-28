define(["require", "exports", './SearchCtrl', './CalendarCtrl', '../Module'], function(require, exports, SearchCtrl, CalendarCtrl, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);

    
    return niceControllers;
});
//# sourceMappingURL=Controllers.js.map

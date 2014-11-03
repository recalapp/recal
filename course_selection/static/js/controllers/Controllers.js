define(["require", "exports", './TestCtrl1', './TestCtrl2', './SearchCtrl', './CalendarCtrl', '../Module'], function(require, exports, TestCtrl1, TestCtrl2, SearchCtrl, CalendarCtrl, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);
    niceControllers.addController('TestCtrl1', TestCtrl1);
    niceControllers.addController('TestCtrl2', TestCtrl2);

    
    return niceControllers;
});
//# sourceMappingURL=Controllers.js.map

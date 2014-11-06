define(["require", "exports", './SearchCtrl', './CalendarCtrl', './QueueCtrl', './TestCtrl1', './TestCtrl2', '../Module'], function(require, exports, SearchCtrl, CalendarCtrl, QueueCtrl, TestCtrl1, TestCtrl2, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);
    niceControllers.addController('QueueCtrl', QueueCtrl);
    niceControllers.addController('TestCtrl1', TestCtrl1);
    niceControllers.addController('TestCtrl2', TestCtrl2);

    
    return niceControllers;
});
//# sourceMappingURL=Controllers.js.map

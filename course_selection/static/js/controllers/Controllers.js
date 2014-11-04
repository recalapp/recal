define(["require", "exports", './SearchCtrl', './CalendarCtrl', './QueueCtrl', '../Module'], function(require, exports, SearchCtrl, CalendarCtrl, QueueCtrl, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);
    niceControllers.addController('QueueCtrl', QueueCtrl);

    
    return niceControllers;
});

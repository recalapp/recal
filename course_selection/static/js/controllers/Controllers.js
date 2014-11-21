define(["require", "exports", './SearchCtrl', './CalendarCtrl', './QueueCtrl', './TabCtrl', './SemCtrl', '../Module'], function(require, exports, SearchCtrl, CalendarCtrl, QueueCtrl, TabCtrl, SemCtrl, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);
    niceControllers.addController('QueueCtrl', QueueCtrl);
    niceControllers.addController('TabCtrl', TabCtrl);
    niceControllers.addController('SemCtrl', SemCtrl);

    
    return niceControllers;
});

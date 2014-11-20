define(["require", "exports", './SearchCtrl', './CalendarCtrl', './QueueCtrl', './TabCtrl', '../Module'], function(require, exports, SearchCtrl, CalendarCtrl, QueueCtrl, TabCtrl, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);
    niceControllers.addController('QueueCtrl', QueueCtrl);
    niceControllers.addController('TabCtrl', TabCtrl);

    
    return niceControllers;
});

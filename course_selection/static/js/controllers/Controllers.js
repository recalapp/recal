define(["require", "exports", './SearchCtrl', './CalendarCtrl', './ScheduleCtrl', './SemCtrl', './MainCtrl', '../Module'], function(require, exports, SearchCtrl, CalendarCtrl, ScheduleCtrl, SemCtrl, MainCtrl, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);
    niceControllers.addController('ScheduleCtrl', ScheduleCtrl);
    niceControllers.addController('SemCtrl', SemCtrl);
    niceControllers.addController('MainCtrl', MainCtrl);

    
    return niceControllers;
});

define(["require", "exports", './SearchCtrl', './CalendarCtrl', './ScheduleCtrl', './SemCtrl', '../Module'], function (require, exports, SearchCtrl, CalendarCtrl, ScheduleCtrl, SemCtrl, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);
    niceControllers.addController('ScheduleCtrl', ScheduleCtrl);
    niceControllers.addController('SemCtrl', SemCtrl);
    return niceControllers;
});
//# sourceMappingURL=Controllers.js.map
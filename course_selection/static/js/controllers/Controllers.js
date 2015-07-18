define(["require", "exports", './FriendCtrl', './SearchCtrl', './CourseSearchCtrl', './CalendarCtrl', './ScheduleCtrl', './SemCtrl', './MainCtrl', '../Module'], function(require, exports, FriendCtrl, SearchCtrl, CourseSearchCtrl, CalendarCtrl, ScheduleCtrl, SemCtrl, MainCtrl, Module) {
    var niceControllers = new Module('niceControllers', []);
    niceControllers.addController('FriendCtrl', FriendCtrl);
    niceControllers.addController('SearchCtrl', SearchCtrl);
    niceControllers.addController('CourseSearchCtrl', CourseSearchCtrl);
    niceControllers.addController('CalendarCtrl', CalendarCtrl);
    niceControllers.addController('ScheduleCtrl', ScheduleCtrl);
    niceControllers.addController('SemCtrl', SemCtrl);
    niceControllers.addController('MainCtrl', MainCtrl);

    
    return niceControllers;
});
//# sourceMappingURL=Controllers.js.map

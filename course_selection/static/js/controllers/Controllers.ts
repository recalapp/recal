import SearchCtrl = require('./SearchCtrl');
import CalendarCtrl = require('./CalendarCtrl');
import ScheduleCtrl = require('./ScheduleCtrl');
import SemCtrl = require('./SemCtrl');
import Module = require('../Module');

var niceControllers = new Module('niceControllers', []);
niceControllers.addController('SearchCtrl', SearchCtrl);
niceControllers.addController('CalendarCtrl', CalendarCtrl);
niceControllers.addController('ScheduleCtrl', ScheduleCtrl);
niceControllers.addController('SemCtrl', SemCtrl);

export = niceControllers;

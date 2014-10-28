import SearchCtrl = require('./SearchCtrl');
import CalendarCtrl = require('./CalendarCtrl');
import Module = require('../Module');

var niceControllers = new Module('niceControllers', []);
niceControllers.addController('SearchCtrl', SearchCtrl);
niceControllers.addController('CalendarCtrl', CalendarCtrl);

export = niceControllers;

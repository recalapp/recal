import SearchCtrl = require('./SearchCtrl');
import CalendarCtrl = require('./CalendarCtrl');
import QueueCtrl = require('./QueueCtrl');
import TabCtrl = require('./TabCtrl');
import Module = require('../Module');

var niceControllers = new Module('niceControllers', []);
niceControllers.addController('SearchCtrl', SearchCtrl);
niceControllers.addController('CalendarCtrl', CalendarCtrl);
niceControllers.addController('QueueCtrl', QueueCtrl);
niceControllers.addController('TabCtrl', TabCtrl);

export = niceControllers;

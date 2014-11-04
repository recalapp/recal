import SearchCtrl = require('./SearchCtrl');
import CalendarCtrl = require('./CalendarCtrl');
import QueueCtrl = require('./QueueCtrl');
import Module = require('../Module');

var niceControllers = new Module('niceControllers', []);
niceControllers.addController('SearchCtrl', SearchCtrl);
niceControllers.addController('CalendarCtrl', CalendarCtrl);
niceControllers.addController('QueueCtrl', QueueCtrl);

export = niceControllers;

import SearchCtrl = require('./SearchCtrl');
import CalendarCtrl = require('./CalendarCtrl');
import QueueCtrl = require('./QueueCtrl');
import TestCtrl1 = require('./TestCtrl1');
import TestCtrl2 = require('./TestCtrl2');
import Module = require('../Module');

var niceControllers = new Module('niceControllers', []);
niceControllers.addController('SearchCtrl', SearchCtrl);
niceControllers.addController('CalendarCtrl', CalendarCtrl);
niceControllers.addController('QueueCtrl', QueueCtrl);
niceControllers.addController('TestCtrl1', TestCtrl1);
niceControllers.addController('TestCtrl2', TestCtrl2);

export = niceControllers;

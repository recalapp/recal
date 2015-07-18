/// <reference path='../../ts/typings/tsd.d.ts' />
import IScheduleManager = require('../interfaces/IScheduleManager')
import Utils = require('../Utils');

'use strict';

class FriendCtrl {
    private scheduleManager: IScheduleManager;
    private static COMPONENT_ID: string = "friend";

    public static $inject = [
        '$scope'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope)
    {
        this.scheduleManager = (<any>this.$scope.$parent).schedule.scheduleManager;
        this.$scope.data = this.scheduleManager.getData();
    }
}

export = FriendCtrl;

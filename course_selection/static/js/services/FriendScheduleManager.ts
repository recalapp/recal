'use strict';

import ISchedule = require('./interfaces/ISchedule');
import ScheduleService = require('./ScheduleService');

class FriendScheduleManager {
    public currentFriendSchedule: ISchedule;

    public static $inject = [
        'ScheduleService'
    ];

    constructor(private scheduleService) {
        this.currentFriendSchedule = null;
    }
}

export = FriendScheduleManager;

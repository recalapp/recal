'use strict';

import ISchedule = require('../interfaces/ISchedule');
import IUser = require('../interfaces/IUser');
import ScheduleService = require('./ScheduleService');
import UserService = require('./UserService');

class FriendScheduleManager {
    private friendSchedules: { [netid: string] : ISchedule[] };
    public currentFriendSchedule: ISchedule;

    public static $inject = [
        'ScheduleService',
        'UserService'
    ];

    constructor(private scheduleService: ScheduleService, private userService: UserService) {
        this.currentFriendSchedule = null;
        this.friendSchedules = {};
        this.userService.user.$promise.then((user) => {
            (<IUser[]>user.friends).forEach((friend) => {
                console.log("getting " + friend.netid + "'s schedules'");
                this.scheduleService.getByUser(friend.netid).$promise.then((schedules) => {
                    console.log("got " + schedules.length + " " + friend.netid + " schedules");
                    this.friendSchedules[friend.netid] = schedules;
                })
            });
        })
    }

    public getFriendSchedules(netid: string): ISchedule[] {
        return this.friendSchedules[netid];
    }
}

export = FriendScheduleManager;

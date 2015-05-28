/// <reference path='../../ts/typings/tsd.d.ts' />

'use strict';

class ScheduleService {

    public static $inject = [
        'ScheduleResource'
    ];

    constructor(private scheduleResource) {
    }

    public getByUser(netid: string) {
        return this.scheduleResource.getByUser({user__netid: netid});
    }
}

export = ScheduleService;

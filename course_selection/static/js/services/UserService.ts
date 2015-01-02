'use strict';

declare var username: string;

class UserService {
    public static $inject = [
        'ScheduleService',
        'UserResource'
    ];

    private _data = {
        user: null,
        schedules: null
    };

    constructor(
            private scheduleService,
            private userResource) {
        this._data.user = this.userResource.getByNetId({'netid': username});
        this._data.schedules = this.scheduleService.getByUser(username);
    }

    public get data(): any {
        return this._data;
    }

    public get schedules(): Array<any> {
        return this._data.schedules;
    }

    public get user(): any {
        return this._data.user;
    }
}

export = UserService;

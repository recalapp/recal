'use strict';

declare var username: string;

class UserService {
    public static $inject = [
        'ScheduleService',
        'UserResource',
        'FriendResource'
    ];

    private _data = {
        user: null,
        all_users: null,
        schedules: null
    };

    constructor(
            private scheduleService,
            private userResource,
            private friendResource) {
        this._data.user = this.userResource.getByNetId({'netid': username});
        this._data.all_users = this.friendResource.query();
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

    // TODO: implement this--return all users
    public get all_users(): any {
        return this._data.all_users;
    }
}

export = UserService;

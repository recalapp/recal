'use strict';

declare var username: string;

class UserService {
    public static $inject = [
        '$http',
        'ScheduleService',
        'FriendResource',
        'UserResource'
    ];

    private static API_URL = "/course_selection/api/static/users/";

    private _data = {
        user: null,
        all_users: null,
        schedules: null
    };

    constructor(
            private $http,
            private scheduleService,
            private friendResource,
            private userResource) {
        this._data.user = this.userResource.getByNetId({'netid': username});
        this._data.all_users =
        this.$http.get(UserService.API_URL).then((response) => {
            return response.data;
        });
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

    public get all_users(): any {
        return this._data.all_users;
    }
}

export = UserService;

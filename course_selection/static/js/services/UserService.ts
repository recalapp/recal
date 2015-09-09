import Utils = require('../Utils');

'use strict';

declare var username: string;

class UserService {
    public static $inject = [
        '$http',
        'ScheduleService',
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
        private userResource) {
            this._data.schedules = this.scheduleService.getByUser(username);
            this._data.user = this.userResource.getByNetId({'netid': username});
            this._data.all_users =
            this.$http.get(UserService.API_URL).then((response) => {
                return response.data;
            }).then((all_users) => {
                // remove all friends and self from list of all searchable users
                this._data.user.$promise.then((self) => {
                    Utils.removeFromList(self, all_users, Utils.userComp);

                    for (var i = 0; i < self.friends.length; i++) {
                        Utils.removeFromList(self.friends[i], all_users, Utils.userComp);
                    }

                    return self;
                });

                return all_users;
            });
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

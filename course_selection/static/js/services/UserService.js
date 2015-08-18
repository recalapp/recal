'use strict';
define(["require", "exports"], function (require, exports) {
    var UserService = (function () {
        function UserService(scheduleService, userResource, friendResource) {
            this.scheduleService = scheduleService;
            this.userResource = userResource;
            this.friendResource = friendResource;
            this._data = {
                user: null,
                all_users: null,
                schedules: null
            };
            this._data.user = this.userResource.getByNetId({ 'netid': username });
            this._data.all_users = this.friendResource.query();
            this._data.schedules = this.scheduleService.getByUser(username);
        }
        Object.defineProperty(UserService.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserService.prototype, "schedules", {
            get: function () {
                return this._data.schedules;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserService.prototype, "user", {
            get: function () {
                return this._data.user;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserService.prototype, "all_users", {
            // TODO: implement this--return all users
            get: function () {
                return this._data.all_users;
            },
            enumerable: true,
            configurable: true
        });
        UserService.$inject = [
            'ScheduleService',
            'UserResource',
            'FriendResource'
        ];
        return UserService;
    })();
    return UserService;
});
//# sourceMappingURL=UserService.js.map
'use strict';
define(["require", "exports"], function (require, exports) {
    var UserService = (function () {
        function UserService($http, scheduleService, friendResource, userResource) {
            this.$http = $http;
            this.scheduleService = scheduleService;
            this.friendResource = friendResource;
            this.userResource = userResource;
            this._data = {
                user: null,
                all_users: null,
                schedules: null
            };
            this._data.user = this.userResource.getByNetId({ 'netid': username });
            this._data.all_users =
                this.$http.get(UserService.API_URL).then(function (response) {
                    return response.data;
                });
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
            get: function () {
                return this._data.all_users;
            },
            enumerable: true,
            configurable: true
        });
        UserService.$inject = [
            '$http',
            'ScheduleService',
            'FriendResource',
            'UserResource'
        ];
        UserService.API_URL = "/course_selection/api/static/users/";
        return UserService;
    })();
    return UserService;
});

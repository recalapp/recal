define(["require", "exports", '../Utils'], function (require, exports, Utils) {
    'use strict';
    var UserService = (function () {
        function UserService($http, scheduleService, userResource) {
            var _this = this;
            this.$http = $http;
            this.scheduleService = scheduleService;
            this.userResource = userResource;
            this._data = {
                user: null,
                all_users: null,
                schedules: null
            };
            this._data.schedules = this.scheduleService.getByUser(username);
            this._data.user = this.userResource.getByNetId({ 'netid': username });
            this._data.all_users =
                this.$http.get(UserService.API_URL).then(function (response) {
                    return response.data;
                }).then(function (all_users) {
                    _this._data.user.$promise.then(function (self) {
                        Utils.removeFromList(self, all_users, function (a, b) {
                            return a.netid === b.netid;
                        });
                        for (var i = 0; i < self.friends.length; i++) {
                            Utils.removeFromList(self.friends[i], all_users, function (a, b) {
                                return a.netid === b.netid;
                            });
                        }
                        return self;
                    });
                    return all_users;
                });
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
            'UserResource'
        ];
        UserService.API_URL = "/course_selection/api/static/users/";
        return UserService;
    })();
    return UserService;
});

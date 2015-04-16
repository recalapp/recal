'use strict';
define(["require", "exports"], function(require, exports) {
    var UserService = (function () {
        function UserService(scheduleService, userResource) {
            this.scheduleService = scheduleService;
            this.userResource = userResource;
            this._data = {
                user: null,
                schedules: null
            };
            this._data.user = this.userResource.getByNetId({ 'netid': username });
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
        UserService.$inject = [
            'ScheduleService',
            'UserResource'
        ];
        return UserService;
    })();

    
    return UserService;
});

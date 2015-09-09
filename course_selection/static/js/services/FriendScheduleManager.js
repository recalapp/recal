'use strict';
define(["require", "exports"], function (require, exports) {
    var FriendScheduleManager = (function () {
        function FriendScheduleManager(scheduleService, userService) {
            var _this = this;
            this.scheduleService = scheduleService;
            this.userService = userService;
            this.currentFriendSchedule = null;
            this.friendSchedules = {};
            this.userService.user.$promise.then(function (user) {
                user.friends.forEach(function (friend) {
                    console.log("getting " + friend.netid + "'s schedules'");
                    _this.scheduleService.getByUser(friend.netid).$promise.then(function (schedules) {
                        console.log("got " + schedules.length + " " + friend.netid + " schedules");
                        _this.friendSchedules[friend.netid] = schedules;
                    });
                });
            });
        }
        FriendScheduleManager.prototype.getFriendSchedules = function (netid) {
            return this.friendSchedules[netid];
        };
        FriendScheduleManager.$inject = [
            'ScheduleService',
            'UserService'
        ];
        return FriendScheduleManager;
    })();
    return FriendScheduleManager;
});

'use strict';
define(["require", "exports"], function (require, exports) {
    var FriendScheduleManager = (function () {
        function FriendScheduleManager(scheduleService) {
            this.scheduleService = scheduleService;
            this.currentFriendSchedule = null;
        }
        FriendScheduleManager.$inject = [
            'ScheduleService'
        ];
        return FriendScheduleManager;
    })();
    return FriendScheduleManager;
});

/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports"], function (require, exports) {
    var ScheduleService = (function () {
        function ScheduleService(scheduleResource) {
            this.scheduleResource = scheduleResource;
        }
        ScheduleService.prototype.getByUser = function (netid) {
            return this.scheduleResource.getByUser({ user__netid: netid });
        };
        ScheduleService.$inject = [
            'ScheduleResource'
        ];
        return ScheduleService;
    })();
    return ScheduleService;
});
//# sourceMappingURL=ScheduleService.js.map
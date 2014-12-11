'use strict';

declare var username: string;

class MainCtrl {
    public static $inject = [
        '$scope',
        'ScheduleResource',
        'CourseResource',
        'UserService',
    ];

    private data;
    private username;

    constructor(
            private $scope,
            private scheduleResource,
            private courseResource,
            private userService
            )
    {
        this.init();
    }

    private init() {
        this.$scope.vm = this;
        this.username = username;
        this.data = {
            user: null,
            schedules: null
        };

        this.loadUserData();
    }

    public loadUserData() {
        this.data.user = this.userService.getUser(this.username);
        this.scheduleResource.getByUser({user__netid: this.username}).$promise.then(
                (schedules) => {
                    this.data.schedules = schedules;
                    console.log(JSON.stringify(schedules));
                });
    }

}

export = MainCtrl;

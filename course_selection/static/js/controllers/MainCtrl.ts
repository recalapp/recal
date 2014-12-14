'use strict';

declare var username: string;

class MainCtrl {
    public static $inject = [
        '$scope',
        'ScheduleService',
        'UserService',
    ];

    private data;
    private username;

    constructor(
            private $scope,
            private scheduleService,
            private userService
            )
    {
        this.init();
    }

    private init() {
        this.$scope.vm = this;
        this.initData();
    }

    private initData() {
        this.username = username;
        this.data = {
            user: null,
            schedules: null
        };

        this.$scope.data = this.data;
        this.loadUserData();
    }

    public loadUserData() {
        this.data.user = this.userService.getByNetId(this.username);
        this.data.schedules = this.scheduleService.getByUser(this.username);   
    }

}

export = MainCtrl;

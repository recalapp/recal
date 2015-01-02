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
        this._init();
    }

    private _init() {
        this._initData();
    }

    private _initData() {
        this.username = username;
        this.data = {
            user: null,
            schedules: null
        };

        this.loadUserData();
        this.$scope.data = this.data;
    }
    
    public loadUserData() {
        this.data = this.userService.data;
    }

}

export = MainCtrl;

'use strict';

declare var username: string;

class MainCtrl {
    public static $inject = [
        '$scope',
        '$resource',
        'CourseResource',
        'UserService',
    ];

    private data;
    private username;

    constructor(
            private $scope,
            private $resource,
            private courseResource,
            private userService
            )
    {
        this.init();
    }

    private init() {
        this.username = username;
        this.data = {
            user: null,
            schedules: null
        };

        this.loadUserData();
    }

    public loadUserData() {
        this.data.user = this.userService.getUser(this.username);
        var scheduleResource = this.$resource('/course_selection/api/v1/schedule/:id', {}, {});
        scheduleResource.get({user__netid: this.username}).$promise.then(
                (schedules) => {
                    console.log(JSON.stringify(schedules.objects));
                });
    }

}

export = MainCtrl;

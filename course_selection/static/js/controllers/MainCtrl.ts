'use strict';

class MainCtrl {
    public static $inject = [
        '$scope',
        'CourseResource',
        'UserService',
    ];

    private data;

    constructor(
            private $scope,
            private courseResource,
            private userService
            )
    {
        this.data = {
            user: null
        };

        this.loadUserData();
    }

    public loadUserData() {
        this.userService.getUser('dxue', this.data);
    }

}

export = MainCtrl;

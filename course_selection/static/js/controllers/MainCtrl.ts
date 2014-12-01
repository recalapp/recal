'use strict';

class MainCtrl {
    public static $inject = [
        '$scope',
        '$resource'
    ];

    constructor(
            private $scope,
            private $resource
            )
    {
    }

    public loadUserData() {
    }

}

export = MainCtrl;

/// <reference path='../../ts/typings/tsd.d.ts' />
import Utils = require('../Utils');

'use strict';

class FriendCtrl {
    public static $inject = [
        '$scope'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope)
    {
        this.$scope.data = {
            friends: [10, 20, 30]
        };

        this.$scope.loading = true;

        setTimeout(() => {
            this.$scope.loading = false;
        }, 1000);
    }
}

export = FriendCtrl;

/// <reference path='../../ts/typings/tsd.d.ts' />
import SearchCtrl = require('./SearchCtrl');
import Utils = require('../Utils');

'use strict';

class FriendCtrl {
    public static $inject = [
        '$scope',
        'UserService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope, private userService)
    {
        this.$scope.data = {
            friends: [10, 20, 30]
        };

        this._initFriendList();

        this.$scope.loading = true;

        setTimeout(() => {
            this.$scope.loading = false;
        }, 1000);

        this.$scope.$watch(() => {
            return this.$scope.query;
        }, (newVal, oldVal) => {
            // don't do anything if not in friend search mode
            if (this.$scope.whichSearch != SearchCtrl.whichSearchEnum.FRIEND_SEARCH) {
                return;
            }

            this.search(newVal);
        });
    }

    private _initFriendList() {
        var gettingAllUsers = this.userService.all_users.$promise;
        gettingAllUsers.then((users) => {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                console.log(user);
            }

            this.$scope.data.friends = users;
        })
    }

    // TODO: implement this
    public search(query:string) {
        console.log("friend search query: " + query);
    }
}

export = FriendCtrl;

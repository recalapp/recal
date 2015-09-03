/// <reference path='../../ts/typings/tsd.d.ts' />
import SearchCtrl = require('./SearchCtrl');
import ScheduleService = require('../services/ScheduleService');
import IUser = require('../interfaces/IUser');
import Utils = require('../Utils');

'use strict';

class FriendCtrl {
    public static $inject = [
        '$scope',
        '$filter',
        'UserService',
        'ScheduleService',
        'FriendRequestResource'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(
        private $scope,
        private $filter,
        private userService,
        private scheduleService: ScheduleService,
        private friendRequestResource)
    {
        this._initFriendList();
        this._initLoading();
        this._initSearchWatches();
    }

    private _initSearchWatches () {
        this.$scope.$watch(() => {
            return this.$scope.whichSearch;
        }, (newVal, oldVal) => {
            if (newVal == oldVal) {
                return;
            }

            if (newVal == SearchCtrl.whichSearchEnum.FRIEND_SEARCH) {
                this.search(this.$scope.query);
            }
        });

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

    private _initLoading() {
        this.$scope.loading = true;

        setTimeout(() => {
            this.$scope.loading = false;
        }, 1000);
    }

    private _initFriendList() {
        this.$scope.data = {
            allUsers: [],
            friends: []
        };

        this.$scope.filteredUsers = this.$scope.data.allUsers;

        var gettingAllUsers = this.userService.all_users;
        gettingAllUsers.then((users) => {
            this.$scope.data.allUsers = users;
        });

        var gettingUser = this.userService.user.$promise;
        gettingUser.then((user) => {
            this.$scope.data.friends = user.friends;
        });
    }

    public search(query:string) {
        this.$scope.filteredUsers =
            this.$filter("friendSearch")(this.$scope.data.allUsers, query);

        console.log("user search query: " + query);
    }

    public sendRequest(toUser: IUser) {
        var newRequest = new this.friendRequestResource();
        newRequest.to_user = toUser;
        newRequest.from_user = this.userService.user;
        newRequest.request_accepted = false;
        console.log(newRequest);
        newRequest.$save();
    }

    public defriend(toUser: IUser) {

    }

    public acceptRequest(fromUser: IUser) {

    }

    public onClick(user: IUser) {
        console.log("getting " + user.netid + "'s schedules'");
        this.scheduleService.getByUser(user.netid).$promise.then((schedules) => {
            console.log("got " + schedules.length + " schedules");
            for (let i = 0; i < schedules.length; i++) {
                console.log(schedules[i]);
            }
        });
    }
}

export = FriendCtrl;

/// <reference path='../../ts/typings/tsd.d.ts' />
import SearchCtrl = require('./SearchCtrl');
import ScheduleService = require('../services/ScheduleService');
import FriendScheduleManager = require('../services/FriendScheduleManager');
import Utils = require('../Utils');

import IUser = require('../interfaces/IUser');
import IFriendRequestResource = require('../interfaces/IFriendRequestResource');

'use strict';

declare var username: string;

class FriendCtrl {
    public static $inject = [
        '$scope',
        '$filter',
        'UserService',
        'ScheduleService',
        'FriendRequestResource',
        'FriendScheduleManager'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(
        private $scope,
        private $filter,
        private userService,
        private scheduleService: ScheduleService,
        private friendRequestResource: angular.resource.IResourceClass<IFriendRequestResource>,
        private friendScheduleManager: FriendScheduleManager)
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

        this.$scope.$watchCollection(() => {
            return this.$scope.data.allUsers;
        }, (newVal, oldVal) => {
            if (newVal == oldVal) {
                return;
            }

            this.search(this.$scope.query);
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
            friends: [],
            receivedFriendRequests: [],
            sentFriendRequests: []
        };

        this.$scope.filteredUsers = [];
        this.userService.all_users.then((users) => {
            this.$scope.data.allUsers = users;
        });
        this.$scope.data.friends = this.userService.user.friends;
        this.$scope.data.receivedFriendRequests = this.friendRequestResource.query({"to_user__netid" : username});

        this.friendRequestResource.query({"from_user__netid" : username})
        .$promise.then((sendReqs: IFriendRequestResource[]) => {
            this.userService.all_users.then((all_users) => {
                for (var i = 0; i < sendReqs.length; i++) {
                    Utils.removeFromList(sendReqs[i].to_user, all_users, Utils.userComp);
                }

                this.$scope.data.allUsers = all_users;
            });

            this.$scope.data.sentFriendRequests = sendReqs;
        });
    }

    public search(query:string) {
        this.$scope.filteredUsers =
            this.$filter("friendSearch")(this.$scope.data.allUsers, query);
    }

    public sendRequest(toUser: IUser) {
        var newRequest = new this.friendRequestResource();

        // send request
        newRequest.to_user = toUser;
        newRequest.from_user = this.userService.user;
        newRequest.$save();

        // update local lists for display
        this.$scope.data.sentFriendRequests.push(newRequest);
        Utils.removeFromList(toUser, this.$scope.data.allUsers, Utils.userComp);
    }

    private _friendIdxInList(friend: IUser, list: IUser[]) {
        return Utils.idxInList(friend, list, Utils.userComp);
    }

    private _removeFriendFromList(friend: IUser, list: IUser[]) {
        return Utils.removeFromList(friend, list, Utils.userComp);
    }

    public defriend(toUser: IUser) {
        this._removeFriendFromList(toUser, this.userService.user.friends);
        this.$scope.data.allUsers.push(toUser);
        this.userService.user.$save();
    }

    /*
    Once friend requests are loaded (the promose becomes determined), we don't
    send any more requests to the server for list updates. This means every time
    we update the list locally (by accepting or rejecting a request), we need to
    do 2 things:
        1. Update the local list, thus updating the UI
        2. remove the request on the server side (send a DELETE)
    */
    private _removeRequest(request: IFriendRequestResource) {
        Utils.removeFromList(request, this.$scope.data.receivedFriendRequests);
        request.$remove({'id': request.id});
    }

    public acceptRequest(request: IFriendRequestResource) {
        var friend = request.from_user;
        this._removeFriendFromList(friend, this.$scope.data.allUsers);
        this.userService.user.friends.push(friend);
        this.userService.user.$save();
        this._removeRequest(request);
    }

    public rejectRequest(request: IFriendRequestResource) {
        this._removeRequest(request);
    }

    public cancelRequest(request: IFriendRequestResource) {
        this.$scope.data.allUsers.push(request.to_user);

        Utils.removeFromList(request, this.$scope.data.sentFriendRequests);
        request.$remove({'id': request.id});
    }

    // TODO: add control to remove friend's schedules
    public onClick(user: IUser) {
        console.log("getting " + user.netid + "'s schedules'");
        this.scheduleService.getByUser(user.netid).$promise.then((schedules) => {
            console.log("got " + schedules.length + " schedules");
            for (let i = 0; i < schedules.length; i++) {
                // TODO: figure out control how to select which one
                this.friendScheduleManager.currentFriendSchedule = schedules[i];
            }
        });
    }
}

export = FriendCtrl;

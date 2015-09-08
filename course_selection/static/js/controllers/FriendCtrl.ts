/// <reference path='../../ts/typings/tsd.d.ts' />
import SearchCtrl = require('./SearchCtrl');
import ScheduleService = require('../services/ScheduleService');
import IUser = require('../interfaces/IUser');
import IFriendRequestResource = require('../interfaces/IFriendRequestResource');
import FriendRequestStatus = require('../models/FriendRequestStatus');
import Utils = require('../Utils');

'use strict';

declare var username: string;

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
        private friendRequestResource: angular.resource.IResourceClass<IFriendRequestResource>)
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

    private _userComp(a: IUser, b:IUser) {
        return a.netid === b.netid;
    }

    // TODO: use same structure as schedule manager
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
        this.$scope.data.sentFriendRequests = this.friendRequestResource.query({"from_user__netid" : username});
        this.$scope.data.receivedFriendRequests = this.friendRequestResource.query({"to_user__netid" : username});
    }

    public search(query:string) {
        this.$scope.filteredUsers =
            this.$filter("friendSearch")(this.$scope.data.allUsers, query);
    }

    // TODO: fix this
    public sendRequest(toUser: IUser) {
        var newRequest = new this.friendRequestResource();
        newRequest.to_user = toUser;
        newRequest.from_user = this.userService.user;
        newRequest.status = FriendRequestStatus.Pending;
        console.log(newRequest);
        newRequest.$save();
    }

    private _friendIdxInList(friend: IUser, list: IUser[]) {
        return Utils.idxInList(friend, list, this._userComp);
    }

    private _removeFriendFromList(friend: IUser, list: IUser[]) {
        return Utils.removeFromList(friend, list, this._userComp);
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
        // TODO: fix this--idk why but this invokes a delete_list() API call
        // instead of a delete_detail()
        request.$remove();
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

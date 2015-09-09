define(["require", "exports", './SearchCtrl', '../Utils'], function (require, exports, SearchCtrl, Utils) {
    'use strict';
    var FriendCtrl = (function () {
        function FriendCtrl($scope, $filter, userService, scheduleService, friendRequestResource) {
            this.$scope = $scope;
            this.$filter = $filter;
            this.userService = userService;
            this.scheduleService = scheduleService;
            this.friendRequestResource = friendRequestResource;
            this._initFriendList();
            this._initLoading();
            this._initSearchWatches();
        }
        FriendCtrl.prototype._initSearchWatches = function () {
            var _this = this;
            this.$scope.$watch(function () {
                return _this.$scope.whichSearch;
            }, function (newVal, oldVal) {
                if (newVal == oldVal) {
                    return;
                }
                if (newVal == SearchCtrl.whichSearchEnum.FRIEND_SEARCH) {
                    _this.search(_this.$scope.query);
                }
            });
            this.$scope.$watch(function () {
                return _this.$scope.query;
            }, function (newVal, oldVal) {
                if (_this.$scope.whichSearch != SearchCtrl.whichSearchEnum.FRIEND_SEARCH) {
                    return;
                }
                _this.search(newVal);
            });
        };
        FriendCtrl.prototype._initLoading = function () {
            var _this = this;
            this.$scope.loading = true;
            setTimeout(function () {
                _this.$scope.loading = false;
            }, 1000);
        };
        FriendCtrl.prototype._userComp = function (a, b) {
            return a.netid === b.netid;
        };
        FriendCtrl.prototype._initFriendList = function () {
            var _this = this;
            this.$scope.data = {
                allUsers: [],
                friends: [],
                receivedFriendRequests: [],
                sentFriendRequests: []
            };
            this.$scope.filteredUsers = [];
            this.userService.all_users.then(function (users) {
                _this.$scope.data.allUsers = users;
            });
            this.$scope.data.friends = this.userService.user.friends;
            this.$scope.data.sentFriendRequests = this.friendRequestResource.query({ "from_user__netid": username });
            this.$scope.data.receivedFriendRequests = this.friendRequestResource.query({ "to_user__netid": username });
        };
        FriendCtrl.prototype.search = function (query) {
            this.$scope.filteredUsers =
                this.$filter("friendSearch")(this.$scope.data.allUsers, query);
        };
        FriendCtrl.prototype.sendRequest = function (toUser) {
            var newRequest = new this.friendRequestResource();
            newRequest.to_user = toUser;
            newRequest.from_user = this.userService.user;
            newRequest.$save();
        };
        FriendCtrl.prototype._friendIdxInList = function (friend, list) {
            return Utils.idxInList(friend, list, this._userComp);
        };
        FriendCtrl.prototype._removeFriendFromList = function (friend, list) {
            return Utils.removeFromList(friend, list, this._userComp);
        };
        FriendCtrl.prototype.defriend = function (toUser) {
            this._removeFriendFromList(toUser, this.userService.user.friends);
            this.$scope.data.allUsers.push(toUser);
            this.userService.user.$save();
        };
        FriendCtrl.prototype._removeRequest = function (request) {
            Utils.removeFromList(request, this.$scope.data.receivedFriendRequests);
            request.$remove({ 'id': request.id });
        };
        FriendCtrl.prototype.acceptRequest = function (request) {
            var friend = request.from_user;
            this._removeFriendFromList(friend, this.$scope.data.allUsers);
            this.userService.user.friends.push(friend);
            this.userService.user.$save();
            this._removeRequest(request);
        };
        FriendCtrl.prototype.rejectRequest = function (request) {
            this._removeRequest(request);
        };
        FriendCtrl.prototype.onClick = function (user) {
            console.log("getting " + user.netid + "'s schedules'");
            this.scheduleService.getByUser(user.netid).$promise.then(function (schedules) {
                console.log("got " + schedules.length + " schedules");
                for (var i = 0; i < schedules.length; i++) {
                    console.log(schedules[i]);
                }
            });
        };
        FriendCtrl.$inject = [
            '$scope',
            '$filter',
            'UserService',
            'ScheduleService',
            'FriendRequestResource'
        ];
        return FriendCtrl;
    })();
    return FriendCtrl;
});

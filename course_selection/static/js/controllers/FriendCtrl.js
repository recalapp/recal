define(["require", "exports", './SearchCtrl', '../Utils'], function (require, exports, SearchCtrl, Utils) {
    'use strict';
    var FriendCtrl = (function () {
        function FriendCtrl($scope, $filter, userService, scheduleService, friendRequestResource, friendScheduleManager) {
            this.$scope = $scope;
            this.$filter = $filter;
            this.userService = userService;
            this.scheduleService = scheduleService;
            this.friendRequestResource = friendRequestResource;
            this.friendScheduleManager = friendScheduleManager;
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
            this.$scope.$watchCollection(function () {
                return _this.$scope.data.allUsers;
            }, function (newVal, oldVal) {
                if (newVal == oldVal) {
                    return;
                }
                _this.search(_this.$scope.query);
            });
        };
        FriendCtrl.prototype._initLoading = function () {
            var _this = this;
            this.$scope.loading = true;
            setTimeout(function () {
                _this.$scope.loading = false;
            }, 1000);
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
            this.$scope.data.receivedFriendRequests = this.friendRequestResource.query({ "to_user__netid": username });
            this.friendRequestResource.query({ "from_user__netid": username })
                .$promise.then(function (sendReqs) {
                _this.userService.all_users.then(function (all_users) {
                    for (var i = 0; i < sendReqs.length; i++) {
                        Utils.removeFromList(sendReqs[i].to_user, all_users, Utils.userComp);
                    }
                    _this.$scope.data.allUsers = all_users;
                });
                _this.$scope.data.sentFriendRequests = sendReqs;
            });
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
            this.$scope.data.sentFriendRequests.push(newRequest);
            Utils.removeFromList(toUser, this.$scope.data.allUsers, Utils.userComp);
        };
        FriendCtrl.prototype._friendIdxInList = function (friend, list) {
            return Utils.idxInList(friend, list, Utils.userComp);
        };
        FriendCtrl.prototype._removeFriendFromList = function (friend, list) {
            return Utils.removeFromList(friend, list, Utils.userComp);
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
        FriendCtrl.prototype.cancelRequest = function (request) {
            this.$scope.data.allUsers.push(request.to_user);
            Utils.removeFromList(request, this.$scope.data.sentFriendRequests);
            request.$remove({ 'id': request.id });
        };
        FriendCtrl.prototype.onClick = function (user) {
            this.friendScheduleManager.currentFriendSchedule =
                this.friendScheduleManager.getFriendSchedules(user.netid)[0];
        };
        FriendCtrl.$inject = [
            '$scope',
            '$filter',
            'UserService',
            'ScheduleService',
            'FriendRequestResource',
            'FriendScheduleManager'
        ];
        return FriendCtrl;
    })();
    return FriendCtrl;
});

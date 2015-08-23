define(["require", "exports", './SearchCtrl'], function (require, exports, SearchCtrl) {
    'use strict';
    var FriendCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function FriendCtrl($scope, $filter, userService) {
            this.$scope = $scope;
            this.$filter = $filter;
            this.userService = userService;
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
                // don't do anything if not in friend search mode
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
        FriendCtrl.prototype._initFriendList = function () {
            var _this = this;
            this.$scope.data = {
                allUsers: [],
                friends: []
            };
            this.$scope.filteredUsers = this.$scope.data.allUsers;
            var gettingAllUsers = this.userService.all_users.$promise;
            gettingAllUsers.then(function (users) {
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    console.log(user);
                }
                _this.$scope.data.allUsers = users;
            });
        };
        FriendCtrl.prototype.search = function (query) {
            this.$scope.filteredUsers =
                this.$filter("friendSearch")(this.$scope.data.allUsers, query);
            console.log("user search query: " + query);
        };
        FriendCtrl.$inject = [
            '$scope',
            '$filter',
            'UserService'
        ];
        return FriendCtrl;
    })();
    return FriendCtrl;
});
//# sourceMappingURL=FriendCtrl.js.map
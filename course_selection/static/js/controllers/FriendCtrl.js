define(["require", "exports", './SearchCtrl'], function (require, exports, SearchCtrl) {
    'use strict';
    var FriendCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function FriendCtrl($scope, userService) {
            var _this = this;
            this.$scope = $scope;
            this.userService = userService;
            this.$scope.data = {
                friends: [10, 20, 30]
            };
            this._initFriendList();
            this.$scope.loading = true;
            setTimeout(function () {
                _this.$scope.loading = false;
            }, 1000);
            this.$scope.$watch(function () {
                return _this.$scope.query;
            }, function (newVal, oldVal) {
                // don't do anything if not in friend search mode
                if (_this.$scope.whichSearch != SearchCtrl.whichSearchEnum.FRIEND_SEARCH) {
                    return;
                }
                _this.search(newVal);
            });
        }
        FriendCtrl.prototype._initFriendList = function () {
            var _this = this;
            var gettingAllUsers = this.userService.all_users.$promise;
            gettingAllUsers.then(function (users) {
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    console.log(user);
                }
                _this.$scope.data.friends = users;
            });
        };
        // TODO: implement this
        FriendCtrl.prototype.search = function (query) {
            console.log("friend search query: " + query);
        };
        FriendCtrl.$inject = [
            '$scope',
            'UserService'
        ];
        return FriendCtrl;
    })();
    return FriendCtrl;
});
//# sourceMappingURL=FriendCtrl.js.map
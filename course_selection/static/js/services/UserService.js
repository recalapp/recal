define(["require", "exports"], function(require, exports) {
    var UserService = (function () {
        function UserService($resource) {
            this.$resource = $resource;
            this.userResource = this.$resource('/course_selection/api/v1/user', {}, {});
        }
        UserService.prototype.getUser = function (netid, dest) {
            var _this = this;
            var user = this.userResource.get({ 'netid': netid }).$promise.then(function (data) {
                dest.user = _this.onLoaded(data);
                console.log('dest.user is ' + JSON.stringify(dest.user));
            });
        };

        UserService.prototype.onLoaded = function (data) {
            return data['objects'][0];
        };
        UserService.$inject = ['$resource'];
        return UserService;
    })();

    
    return UserService;
});

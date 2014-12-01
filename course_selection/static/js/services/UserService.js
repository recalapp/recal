define(["require", "exports"], function(require, exports) {
    var UserService = (function () {
        function UserService($resource) {
            this.$resource = $resource;
            this.userResource = this.$resource('/course_selection/api/v1/user', {}, {});
        }
        UserService.prototype.getUser = function (netid) {
            // var temp = this.localStorageService.get('nice-user');
            // if (temp != null && temp.netid == netid) {
            // }
        };
        UserService.$inject = ['$resource'];
        return UserService;
    })();

    
    return UserService;
});

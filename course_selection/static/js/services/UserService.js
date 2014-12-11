define(["require", "exports"], function(require, exports) {
    var UserService = (function () {
        function UserService($resource) {
            this.$resource = $resource;
            this.userResource = this.$resource('/course_selection/api/v1/user/:id', {}, {
                getUser: {
                    method: 'GET',
                    isArray: false,
                    transformResponse: this.getFirstObject
                }
            });
        }
        UserService.prototype.getUser = function (netid) {
            return this.userResource.getUser({ 'netid': netid });
        };

        UserService.prototype.getFirstObject = function (data, header) {
            var parsed = JSON.parse(data);
            return parsed.objects[0];
        };
        UserService.$inject = ['$resource'];
        return UserService;
    })();

    
    return UserService;
});

define(["require", "exports"], function(require, exports) {
    var UserService = (function () {
        function UserService(userResource) {
            this.userResource = userResource;
        }
        UserService.prototype.getUser = function (netid) {
            return this.userResource.getUser({ 'netid': netid });
        };
        UserService.$inject = ['UserResource'];
        return UserService;
    })();

    
    return UserService;
});

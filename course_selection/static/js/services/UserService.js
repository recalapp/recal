define(["require", "exports"], function(require, exports) {
    var UserService = (function () {
        function UserService(userResource) {
            this.userResource = userResource;
        }
        UserService.prototype.getByNetId = function (netid) {
            return this.userResource.getByNetId({ 'netid': netid });
        };
        UserService.$inject = ['UserResource'];
        return UserService;
    })();

    
    return UserService;
});
//# sourceMappingURL=UserService.js.map

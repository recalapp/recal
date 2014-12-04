'use strict';
define(["require", "exports"], function(require, exports) {
    var MainCtrl = (function () {
        function MainCtrl($scope, courseResource, userService) {
            this.$scope = $scope;
            this.courseResource = courseResource;
            this.userService = userService;
            this.data = {
                user: null
            };

            this.loadUserData();
        }
        MainCtrl.prototype.loadUserData = function () {
            this.userService.getUser('dxue', this.data);
        };
        MainCtrl.$inject = [
            '$scope',
            'CourseResource',
            'UserService'
        ];
        return MainCtrl;
    })();

    
    return MainCtrl;
});
//# sourceMappingURL=MainCtrl.js.map

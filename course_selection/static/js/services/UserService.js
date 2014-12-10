define(["require", "exports"], function(require, exports) {
    var UserService = (function () {
        function UserService($resource) {
            this.$resource = $resource;
            this.userResource = this.$resource('/course_selection/api/v1/user/:netid', {}, {});
            this.scheduleResource = this.$resource('/course_selection/api/v1/schedule/:scheduleid', {}, {});
        }
        UserService.prototype.getUser = function (netid) {
            return this.userResource.get({ 'netid': netid });
        };

        UserService.prototype.onLoaded = function (data) {
            return data['objects'][0];
        };

        // use resource to get the schedule entry
        // then $save
        UserService.prototype.getSchedule = function (scheduleObj) {
            var user = new this.userResource(this.user.id);
            console.log(JSON.stringify(user));

            this.scheduleResource.get({ 'user__id': this.user.id }).$promise.then(function (schedule) {
                console.log(JSON.stringify(schedule));
            });
            ;
        };
        UserService.$inject = ['$resource'];
        return UserService;
    })();

    
    return UserService;
});

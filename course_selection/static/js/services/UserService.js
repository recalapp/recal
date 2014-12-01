define(["require", "exports"], function(require, exports) {
    var UserService = (function () {
        function UserService($resource) {
            this.$resource = $resource;
            this.userResource = this.$resource('/course_selection/api/v1/user/:userId', { userId: '@id' }, {});
            this.scheduleResource = this.$resource('/course_selection/api/v1/schedule', {}, {});
        }
        UserService.prototype.getUser = function (netid, dest) {
            var _this = this;
            var user = this.userResource.get({ 'netid': netid });
            user.$promise.then(function (data) {
                dest.user = _this.onLoaded(data);
                _this.user = _this.onLoaded(data);
                console.log('dest.user is ' + JSON.stringify(dest.user));
                _this.saveSchedule(null);
            });
        };

        UserService.prototype.onLoaded = function (data) {
            return data['objects'][0];
        };

        // use resource to get the schedule entry
        // then $save
        UserService.prototype.saveSchedule = function (scheduleObj) {
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

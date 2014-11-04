define(["require", "exports"], function(require, exports) {
    'use strict';

    var QueueCtrl = (function () {
        function QueueCtrl($scope, testSharingService) {
            var _this = this;
            this.$scope = $scope;
            this.testSharingService = testSharingService;
            this.$scope.vm = this;
            this.$scope.data = testSharingService.getData();
            this.$scope.$watch(function () {
                return _this.$scope.data.enrolledCourses;
            }, function (newCourses, oldCourses) {
                return _this.updateEnrolledCourses(newCourses, oldCourses);
            }, true);
        }
        QueueCtrl.prototype.updateEnrolledCourses = function (newCourses, oldCourses) {
            this.$scope.enrolledCourses = newCourses;
        };
        QueueCtrl.$inject = [
            '$scope',
            'TestSharingService'
        ];
        return QueueCtrl;
    })();

    
    return QueueCtrl;
});

define(["require", "exports"], function (require, exports) {
    var NewScheduleModalCtrl = (function () {
        function NewScheduleModalCtrl($scope, $modalInstance, semester) {
            var _this = this;
            this.$scope = $scope;
            this.$modalInstance = $modalInstance;
            this.semester = semester;
            this.$scope.semester = this.semester;
            this.$scope.ok = function () {
                _this.ok();
            };
            this.$scope.cancel = function () {
                _this.cancel();
            };
        }
        NewScheduleModalCtrl.prototype.ok = function () {
            this.$modalInstance.close(this.$scope.newName);
        };
        NewScheduleModalCtrl.prototype.cancel = function () {
            this.$modalInstance.dismiss('cancel');
        };
        NewScheduleModalCtrl.$inject = [
            '$scope',
            '$modalInstance',
            'semester'
        ];
        return NewScheduleModalCtrl;
    })();
    return NewScheduleModalCtrl;
});
//# sourceMappingURL=NewScheduleModalCtrl.js.map
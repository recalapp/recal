define(["require", "exports"], function(require, exports) {
    var NewScheduleModalCtrl = (function () {
        function NewScheduleModalCtrl($scope, $modalInstance, canDismiss, semester) {
            var _this = this;
            this.$scope = $scope;
            this.$modalInstance = $modalInstance;
            this.canDismiss = canDismiss;
            this.semester = semester;
            this.$scope.canDismiss = this.canDismiss;
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
            'canDismiss',
            'semester'
        ];
        return NewScheduleModalCtrl;
    })();

    
    return NewScheduleModalCtrl;
});

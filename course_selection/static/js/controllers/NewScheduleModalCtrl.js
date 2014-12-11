define(["require", "exports"], function(require, exports) {
    var NewScheduleModalCtrl = (function () {
        function NewScheduleModalCtrl($scope, $modalInstance, canDismiss) {
            var _this = this;
            this.$scope = $scope;
            this.$modalInstance = $modalInstance;
            this.canDismiss = canDismiss;
            this.$scope.canDismiss = this.canDismiss;

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
            'canDismiss'
        ];
        return NewScheduleModalCtrl;
    })();

    
    return NewScheduleModalCtrl;
});

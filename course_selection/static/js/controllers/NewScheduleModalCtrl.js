define(["require", "exports"], function(require, exports) {
    var NewScheduleModalCtrl = (function () {
        function NewScheduleModalCtrl($scope, $modalInstance) {
            var _this = this;
            this.$scope = $scope;
            this.$modalInstance = $modalInstance;
            this.$scope.ok = function () {
                _this.ok();
            };

            this.$scope.cancel = function () {
                _this.cancel();
            };
        }
        NewScheduleModalCtrl.prototype.ok = function () {
            this.$modalInstance.close();
        };

        NewScheduleModalCtrl.prototype.cancel = function () {
            this.$modalInstance.dismiss('cancel');
        };
        NewScheduleModalCtrl.$inject = [
            '$scope',
            '$modalInstance'
        ];
        return NewScheduleModalCtrl;
    })();

    
    return NewScheduleModalCtrl;
});

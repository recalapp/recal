define(["require", "exports"], function(require, exports) {
    var RemoveScheduleModalCtrl = (function () {
        function RemoveScheduleModalCtrl($scope, $modalInstance, message) {
            var _this = this;
            this.$scope = $scope;
            this.$modalInstance = $modalInstance;
            this.message = message;
            this.$scope.message = message;

            this.$scope.ok = function () {
                _this.ok();
            };

            this.$scope.cancel = function () {
                _this.cancel();
            };
        }
        RemoveScheduleModalCtrl.prototype.ok = function () {
            this.$modalInstance.close();
        };

        RemoveScheduleModalCtrl.prototype.cancel = function () {
            this.$modalInstance.dismiss('cancel');
        };
        RemoveScheduleModalCtrl.$inject = [
            '$scope',
            '$modalInstance',
            'message'
        ];
        return RemoveScheduleModalCtrl;
    })();

    
    return RemoveScheduleModalCtrl;
});
//# sourceMappingURL=RemoveScheduleModalCtrl.js.map

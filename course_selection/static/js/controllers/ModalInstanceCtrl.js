define(["require", "exports"], function(require, exports) {
    var ModalInstanceCtrl = (function () {
        function ModalInstanceCtrl($scope, $modalInstance) {
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
        ModalInstanceCtrl.prototype.ok = function () {
            this.$modalInstance.close();
        };

        ModalInstanceCtrl.prototype.cancel = function () {
            this.$modalInstance.dismiss('cancel');
        };
        ModalInstanceCtrl.$inject = [
            '$scope',
            '$modalInstance'
        ];
        return ModalInstanceCtrl;
    })();

    
    return ModalInstanceCtrl;
});

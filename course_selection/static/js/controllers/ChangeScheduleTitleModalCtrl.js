define(["require", "exports"], function (require, exports) {
    var ChangeScheduleTitleModalCtrl = (function () {
        function ChangeScheduleTitleModalCtrl($scope, $modalInstance, title) {
            var _this = this;
            this.$scope = $scope;
            this.$modalInstance = $modalInstance;
            this.$scope.confirmation = "Schedule Title: ";
            this.$scope.title = title;
            this.$scope.ok = function () {
                _this.ok();
            };
            this.$scope.cancel = function () {
                _this.cancel();
            };
        }
        ChangeScheduleTitleModalCtrl.prototype.ok = function () {
            this.$modalInstance.close(this.$scope.title);
        };
        ChangeScheduleTitleModalCtrl.prototype.cancel = function () {
            this.$modalInstance.dismiss('cancel');
        };
        ChangeScheduleTitleModalCtrl.$inject = [
            '$scope',
            '$modalInstance',
            'title'
        ];
        return ChangeScheduleTitleModalCtrl;
    })();
    return ChangeScheduleTitleModalCtrl;
});

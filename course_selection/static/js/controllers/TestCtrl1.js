define(["require", "exports"], function(require, exports) {
    var TestCtrl1 = (function () {
        function TestCtrl1($scope) {
            this.$scope = $scope;
        }
        TestCtrl1.$inject = [
            '$scope'
        ];
        return TestCtrl1;
    })();

    
    return TestCtrl1;
});

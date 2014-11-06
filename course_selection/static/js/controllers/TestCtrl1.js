define(["require", "exports"], function(require, exports) {
    var TestCtrl1 = (function () {
        function TestCtrl1($scope, testSharingService) {
            this.$scope = $scope;
            this.testSharingService = testSharingService;
            $scope.data = testSharingService.getData();
        }
        TestCtrl1.$inject = [
            '$scope',
            'TestSharingService'
        ];
        return TestCtrl1;
    })();

    
    return TestCtrl1;
});
//# sourceMappingURL=TestCtrl1.js.map

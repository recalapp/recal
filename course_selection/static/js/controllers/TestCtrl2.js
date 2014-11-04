define(["require", "exports"], function(require, exports) {
    var TestCtrl2 = (function () {
        function TestCtrl2($scope, testSharingService) {
            this.$scope = $scope;
            this.testSharingService = testSharingService;
            $scope.data = testSharingService.data;
        }
        TestCtrl2.$inject = [
            '$scope',
            'TestSharingService'
        ];
        return TestCtrl2;
    })();

    
    return TestCtrl2;
});

import TestSharingService = require('../services/TestSharingService');

class TestCtrl2 {
    public static $inject = [
        '$scope',
        'TestSharingService'
        ];

    constructor(
            private $scope,
            private testSharingService
            )
    {
        $scope.data = testSharingService.getData();
    }
}

export = TestCtrl2;

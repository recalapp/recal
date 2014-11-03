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
        $scope.data = testSharingService.data;
    }
}


export = TestCtrl2;
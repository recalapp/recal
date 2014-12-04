class RemoveScheduleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        'message'
    ];

    constructor(private $scope, private $modalInstance, private message) {
        this.$scope.message = message;

        this.$scope.ok = () => {
            this.ok();
        };

        this.$scope.cancel = () => {
            this.cancel();
        };
    }

    public ok() {
        this.$modalInstance.close();
    }

    public cancel() {
        this.$modalInstance.dismiss('cancel');
    }
}

export = RemoveScheduleModalCtrl;

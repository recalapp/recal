class RemoveScheduleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        'title'
    ];

    constructor(private $scope, private $modalInstance, title: string) {
        this.$scope.confirmation = "Delete the schedule: ";
        this.$scope.title = title;

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

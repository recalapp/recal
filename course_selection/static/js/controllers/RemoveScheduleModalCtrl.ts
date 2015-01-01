class RemoveScheduleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        'title'
    ];

    constructor(private $scope, private $modalInstance, title: string) {
        this.$scope.message = "You want to delete the schedule: " + title;

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

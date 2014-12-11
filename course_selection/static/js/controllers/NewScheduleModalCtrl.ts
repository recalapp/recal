class NewScheduleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        'canDismiss'
    ];

    constructor(private $scope, private $modalInstance, private canDismiss) {
        this.$scope.canDismiss = this.canDismiss;

        this.$scope.ok = () => {
            this.ok();
        };

        this.$scope.cancel = () => {
            this.cancel();
        };
    }

    public ok() {
        this.$modalInstance.close(this.$scope.newName);
    }

    public cancel() {
        this.$modalInstance.dismiss('cancel');
    }
}

export = NewScheduleModalCtrl;

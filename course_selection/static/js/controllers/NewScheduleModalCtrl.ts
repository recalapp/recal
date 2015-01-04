class NewScheduleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        'semester'
    ];

    constructor(private $scope, private $modalInstance, private semester) {
        this.$scope.semester = this.semester;

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

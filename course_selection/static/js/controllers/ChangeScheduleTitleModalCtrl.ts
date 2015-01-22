class ChangeScheduleTitleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        'title'
    ];

    constructor(private $scope, private $modalInstance, title: string) {
        this.$scope.confirmation = "Schedule Title: ";
        this.$scope.title = title;

        this.$scope.ok = () => {
            this.ok();
        };

        this.$scope.cancel = () => {
            this.cancel();
        };
    }

    public ok() {
        this.$modalInstance.close(this.$scope.title);
    }

    public cancel() {
        this.$modalInstance.dismiss('cancel');
    }
}

export = ChangeScheduleTitleModalCtrl;

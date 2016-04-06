interface IChangeScheduleTitleModalScope extends ng.IScope {
    confirmation: string;
    title: string;
    myForm: ng.IFormController;
    submitForm(): void;
    cancel(): void;
}

class ChangeScheduleTitleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        'title'
    ];

    constructor(private $scope: IChangeScheduleTitleModalScope,
        private $modalInstance, title: string) {
        this.$scope.confirmation = "Schedule Title: ";
        this.$scope.title = title;

        this.$scope.submitForm = () => {
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

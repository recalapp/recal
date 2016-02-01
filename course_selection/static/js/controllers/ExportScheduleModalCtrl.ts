class ExportScheduleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        'id'
    ];

    constructor(private $scope, private $modalInstance, private id) {
        this.$scope.id = this.id; // schedule id

        this.$scope.ok = () => {
            this.ok();
        };

        // this.$scope.cancel = () => {
        //     this.cancel();
        // };
    }

    public ok() {
        this.$modalInstance.close(); // we can pass a param back through the args of this function, e.g. this.$scope.newName
    }

    public cancel() {
        this.$modalInstance.dismiss('cancel');
    }

    // TODO: add methods that will do the AJAX calls. 
}

export = ExportScheduleModalCtrl;

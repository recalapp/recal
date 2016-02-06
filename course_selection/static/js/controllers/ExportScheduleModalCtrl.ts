class ExportScheduleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance',
        '$http',
        'id',
        'url',
        'apiurl'
    ];

    constructor(private $scope, private $modalInstance, private $http, private id, private url, private apiurl) {
        this.$scope.id = this.id; // schedule id
        this.$scope.url = this.url; // schedule ical url
        this.$scope.apiurl = this.apiurl; // api url to regenerate

        this.$scope.ok = () => {
            this.ok();
        };

        // this.$scope.cancel = () => {
        //     this.cancel();
        // };

        this.$scope.regenerate = () => {
          this.getNewUrl();
        }
    }

    public ok() {
        this.$modalInstance.close(); // we can pass a param back through the args of this function, e.g. this.$scope.newName
    }

    /*public cancel() {
        this.$modalInstance.dismiss('cancel');
    }*/

    public getNewUrl() {
      // make ajax call -- change this.$scope.url
      var s = this.$scope;
      this.$http.get(this.$scope.apiurl + this.$scope.id).then(function(response) {
        console.log('Ical api regenerated url: ' + response.data);
        s.url = response.data;
      });
    }

}

export = ExportScheduleModalCtrl;

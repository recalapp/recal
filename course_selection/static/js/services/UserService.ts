class UserService {
    public static $inject = ['$resource'];
    private userResource;
    private user;

    constructor(private $resource) {
        this.userResource = this.$resource('/course_selection/api/v1/user',{},{});
    }

    public getUser(netid: string, dest): any {
        var user = this.userResource.get({'netid': netid}).$promise
            .then((data) => {
                dest.user = this.onLoaded(data);
                console.log('dest.user is ' + JSON.stringify(dest.user));
            });
    }

    public onLoaded(data): any {
        return data['objects'][0];
    }
}

export = UserService;

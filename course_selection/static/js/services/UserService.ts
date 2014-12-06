class UserService {
    public static $inject = ['$resource'];
    private userResource;
    private scheduleResource;
    private user;

    constructor(private $resource) {
        this.userResource = this.$resource('/course_selection/api/v1/user/:userId',{userId: '@id'},{});
        this.scheduleResource = this.$resource('/course_selection/api/v1/schedule', {}, {});
    }

    public getUser(netid: string, dest): any {
        var user = this.userResource.get(netid);
        user.$promise.then((data) => {
                dest.user = this.onLoaded(data);
                this.user = this.onLoaded(data);
                console.log('dest.user is ' + JSON.stringify(dest.user));
                this.saveSchedule(null);
            });
    }

    public onLoaded(data): any {
        return data['objects'][0];
    }

    // use resource to get the schedule entry
    // then $save
    public saveSchedule(scheduleObj): void {
        var user = new this.userResource(this.user.id);
        console.log(JSON.stringify(user));

        this.scheduleResource.get({'user__id': this.user.id})
            .$promise.then((schedule) => {
                console.log(JSON.stringify(schedule))
            });;
    }
}

export = UserService;

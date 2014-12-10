class UserService {
    public static $inject = ['$resource'];
    private userResource;
    private scheduleResource;
    private user;

    constructor(private $resource) {
        this.userResource = this.$resource('/course_selection/api/v1/user/:netid',{},{});
        this.scheduleResource = this.$resource('/course_selection/api/v1/schedule/:scheduleid', {}, {});
    }

    public getUser(netid: string): any {
        return this.userResource.get({'netid': netid});
    }

    public onLoaded(data): any {
        return data['objects'][0];
    }

    // use resource to get the schedule entry
    // then $save
    public getSchedule(scheduleObj): void {
        var user = new this.userResource(this.user.id);
        console.log(JSON.stringify(user));

        this.scheduleResource.get({'user__id': this.user.id})
            .$promise.then((schedule) => {
                console.log(JSON.stringify(schedule))
            });;
    }
}

export = UserService;

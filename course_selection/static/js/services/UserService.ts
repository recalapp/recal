class UserService {
    public static $inject = ['$resource'];
    private userResource;

    constructor(private $resource) {
        this.userResource = this.$resource('/course_selection/api/v1/user',
                {},
                {});
    }

    public getUser(netid: string): any {
        var temp = this.localStorageService.get('nice-user');
        if (temp != null && temp.netid == netid) {
        }
    }
}

export = UserService;

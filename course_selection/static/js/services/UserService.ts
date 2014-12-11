class UserService {
    public static $inject = ['$resource'];
    private userResource;

    constructor(private $resource) {
        this.userResource = this.$resource('/course_selection/api/v1/user/:id',
                {},
                {
                    getUser: {
                        method: 'GET',
                        isArray: false,
                        transformResponse: this.getFirstObject
                    }
                });
    }

    public getUser(netid: string): any {
        return this.userResource.getUser({'netid': netid});
    }

    private getFirstObject(data, header) {
        var parsed = JSON.parse(data);
        return parsed.objects[0];
    }
}

export = UserService;

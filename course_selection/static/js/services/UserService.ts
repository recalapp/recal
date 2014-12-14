class UserService {
    public static $inject = ['UserResource'];

    constructor(private userResource) {
    }

    public getByNetId(netid: string): any {
        return this.userResource.getByNetId({'netid': netid});
    }
}

export = UserService;

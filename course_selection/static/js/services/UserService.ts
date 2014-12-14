class UserService {
    public static $inject = ['UserResource'];

    constructor(private userResource) {
    }

    public getUser(netid: string): any {
        return this.userResource.getUser({'netid': netid});
    }
}

export = UserService;

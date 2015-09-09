import IUser = require('./IUser');

interface IFriendRequest {
    id: number;
    from_user: IUser;
    to_user: IUser;
}

export = IFriendRequest;

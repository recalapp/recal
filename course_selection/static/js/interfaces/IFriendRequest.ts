import IUser = require('./IUser');

interface IFriendRequest {
    from_user: IUser;
    to_user: IUser;
    status: string; // status must be "PEN", "ACC", or "REJ"
}

export = IFriendRequest;

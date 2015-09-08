import IUser = require('./IUser');
import IFriendRequest = require('./IFriendRequest');

interface IFriendRequestResource extends
    angular.resource.IResource<IFriendRequest> {
    from_user: IUser;
    to_user: IUser;
    status: string; // status must be "PEN", "ACC", or "REJ"
}

export = IFriendRequestResource;

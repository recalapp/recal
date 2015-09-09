import IUser = require('./IUser');
import IFriendRequest = require('./IFriendRequest');

interface IFriendRequestResource extends
    angular.resource.IResource<IFriendRequest>, IFriendRequest {
}

export = IFriendRequestResource;

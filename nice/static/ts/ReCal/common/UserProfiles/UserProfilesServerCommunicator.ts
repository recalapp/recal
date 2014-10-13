/// <reference path="../../../typings/tsd.d.ts" />
import $ = require('jquery');

import Dictionary = require('../../../library/DataStructures/Dictionary');
import Server = require('../../../library/Server/Server');
import ServerData = require('./ServerData');
import ServerRequest = require('../../../library/Server/ServerRequest');
import ServerRequestType = require('../../../library/Server/ServerRequestType');
import ServerConnection = require('../../../library/Server/ServerConnection');
import UserProfiles = require('./UserProfiles');
import UserProfilesServerDataToModelConverter = require('./UserProfilesServerDataToModelConverter');

import IServerConnection = Server.IServerConnection;
import IUserProfilesModel = UserProfiles.IUserProfilesModel;
import IUserProfilesServerCommunicator = UserProfiles.IUserProfilesServerCommunicator;
import UserProfileInfoServerData = ServerData.UserProfileInfoServerData;

class UserProfilesServerCommunicator implements IUserProfilesServerCommunicator
{
    private _serverConnection: IServerConnection = new ServerConnection(1);
    private get serverConnection(): IServerConnection { return this._serverConnection; }

    /**
     * Sync the user profile with the server to get the latest information.
     * Returns a JQuery promise that returns a (potentially new) user profile.
     * @param profile
     */
    public updateUserProfile(profile: IUserProfilesModel): JQueryPromise<IUserProfilesModel>
    {
        var deferred = $.Deferred<IUserProfilesModel>();
        var createServerRequest = ()=>
        {
            var serverRequest = new ServerRequest({
                url: '/get/user_profile_info',
                async: false,
                parameters: new Dictionary<string, string>(),
                requestType: ServerRequestType.get,
            });
            return serverRequest;
        };
        this.serverConnection.sendRequest(createServerRequest())
            .done((data: UserProfileInfoServerData)=>
            {
                var converter = new UserProfilesServerDataToModelConverter(profile);
                profile = converter.updateUserProfilesModelWithServerData(data);
                deferred.resolve(profile);
            })
            .fail((data: any)=>
            {
                deferred.resolve(profile);
            });
        return deferred.promise();
    }
}

export = UserProfilesServerCommunicator;
define(["require", "exports", 'jquery', '../../../library/DataStructures/Dictionary', '../../../library/Server/ServerRequest', '../../../library/Server/ServerRequestType', '../../../library/Server/ServerConnection', './UserProfilesServerDataToModelConverter'], function(require, exports, $, Dictionary, ServerRequest, ServerRequestType, ServerConnection, UserProfilesServerDataToModelConverter) {
    var UserProfilesServerCommunicator = (function () {
        function UserProfilesServerCommunicator() {
            this._serverConnection = new ServerConnection(1);
        }
        Object.defineProperty(UserProfilesServerCommunicator.prototype, "serverConnection", {
            get: function () {
                return this._serverConnection;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Sync the user profile with the server to get the latest information.
        * Returns a JQuery promise that returns a (potentially new) user profile.
        * @param profile
        */
        UserProfilesServerCommunicator.prototype.updateUserProfile = function (profile) {
            var deferred = $.Deferred();
            var createServerRequest = function () {
                var serverRequest = new ServerRequest({
                    url: '/get/user_profile_info',
                    async: false,
                    parameters: new Dictionary(),
                    requestType: 0 /* get */
                });
                return serverRequest;
            };
            this.serverConnection.sendRequest(createServerRequest()).done(function (data) {
                var converter = new UserProfilesServerDataToModelConverter(profile);
                profile = converter.updateUserProfilesModelWithServerData(data);
                deferred.resolve(profile);
            }).fail(function (data) {
                deferred.resolve(profile);
            });
            return deferred.promise();
        };
        return UserProfilesServerCommunicator;
    })();

    
    return UserProfilesServerCommunicator;
});
//# sourceMappingURL=UserProfilesServerCommunicator.js.map

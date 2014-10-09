define(["require", "exports", 'jquery', '../../../library/DataStructures/Dictionary', '../Courses/CoursesModel', '../Courses/SectionsModel', '../Courses/SectionTypesModel', '../../../library/Server/ServerRequest', '../../../library/Server/ServerRequestType', '../../../library/Server/ServerConnection'], function(require, exports, $, Dictionary, CoursesModel, SectionsModel, SectionTypesModel, ServerRequest, ServerRequestType, ServerConnection) {
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
            var courseDataToModel = function (data, index) {
                return new CoursesModel({
                    courseId: data.course_id.toString(),
                    title: data.course_title,
                    description: data.course_description,
                    courseListings: data.course_listings.split(/\s*\/\s*/),
                    primaryListing: data.course_primary_listing,
                    sectionsModels: data.sections.map(sectionDataToModel)
                });
            };
            var sectionDataToModel = function (data, index) {
                return new SectionsModel({
                    sectionId: data.section_id.toString(),
                    title: data.section_name,
                    sectionTypesModel: new SectionTypesModel({
                        code: data.section_type_code,
                        displayText: data.section_type_code
                    })
                });
            };
            this.serverConnection.sendRequest(createServerRequest()).done(function (data) {
                profile.username = data.username;
                profile.displayName = data.display_name;
                profile.enrolledCoursesModels = data.enrolled_courses.map(courseDataToModel);
                profile.eventTypes = new Dictionary(data.event_types);
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

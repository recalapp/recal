define(["require", "exports", '../../../library/DataStructures/Dictionary', '../../../library/DataStructures/Set'], function(require, exports, Dictionary, Set) {
    var UserProfilesModel = (function () {
        function UserProfilesModel(copy) {
            this._eventTypes = null;
            this._username = null;
            this._displayName = null;
            this._enrolledCoursesModels = new Set();
            this._agendaVisibleEventTypeCodes = null;
            this._calendarVisibleEventTypeCodes = null;
            if (copy) {
                this.username = copy.username;
                if (copy.displayName) {
                    this.displayName = copy.displayName;
                }
                if (copy.enrolledCoursesModels) {
                    this._enrolledCoursesModels = new Set(copy.enrolledCoursesModels);
                }
            }
        }
        Object.defineProperty(UserProfilesModel.prototype, "eventTypes", {
            get: function () {
                if (!this._eventTypes) {
                    this._eventTypes = new Dictionary();
                }
                return this._eventTypes;
            },
            set: function (value) {
                value = value || new Dictionary();
                this._eventTypes = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(UserProfilesModel.prototype, "username", {
            get: function () {
                return this._username;
            },
            set: function (value) {
                this._username = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(UserProfilesModel.prototype, "displayName", {
            get: function () {
                return this._displayName;
            },
            set: function (value) {
                this._displayName = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(UserProfilesModel.prototype, "enrolledCoursesModels", {
            get: function () {
                return this._enrolledCoursesModels.toArray();
            },
            set: function (value) {
                if (!value) {
                    return;
                }
                this._enrolledCoursesModels = new Set(value);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(UserProfilesModel.prototype, "enrolledSectionsModels", {
            get: function () {
                return this.enrolledCoursesModels.reduce(function (sectionsModels, coursesModel, index) {
                    return sectionsModels.concat(coursesModel.sectionsModels);
                }, []);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(UserProfilesModel.prototype, "agendaVisibleEventTypeCodesSet", {
            get: function () {
                if (!this._agendaVisibleEventTypeCodes) {
                    this._agendaVisibleEventTypeCodes = new Set();
                }
                return this._agendaVisibleEventTypeCodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserProfilesModel.prototype, "agendaVisibleEventTypeCodes", {
            get: function () {
                return this.agendaVisibleEventTypeCodesSet.toArray();
            },
            set: function (value) {
                value = value || [];
                this._agendaVisibleEventTypeCodes = new Set(value);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(UserProfilesModel.prototype, "calendarVisibleEventTypeCodesSet", {
            get: function () {
                if (!this._calendarVisibleEventTypeCodes) {
                    this._calendarVisibleEventTypeCodes = new Set();
                }
                return this._calendarVisibleEventTypeCodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserProfilesModel.prototype, "calendarVisibleEventTypeCodes", {
            get: function () {
                return this.calendarVisibleEventTypeCodesSet.toArray();
            },
            set: function (value) {
                value = value || [];
                this._calendarVisibleEventTypeCodes = new Set(value);
            },
            enumerable: true,
            configurable: true
        });
        return UserProfilesModel;
    })();

    
    return UserProfilesModel;
});
//# sourceMappingURL=UserProfilesModel.js.map

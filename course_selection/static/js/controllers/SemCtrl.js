/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports", '../models/Semester'], function(require, exports, Semester) {
    var SemCtrl = (function () {
        function SemCtrl($scope, localStorageService, userService, semesterService) {
            var _this = this;
            this.$scope = $scope;
            this.localStorageService = localStorageService;
            this.userService = userService;
            this.semesterService = semesterService;
            this.semesters = [];
            this.restoreUserSemesters();
            this.$scope.semesters = this.semesters;
            this.$scope.canAdd = this.canAdd();

            this.$scope.$watchCollection(function () {
                return _this.$scope.semesters;
            }, function (newValue, oldValue) {
                if (newValue != oldValue) {
                    _this.$scope.canAdd = _this.canAdd();
                }
            });
        }
        SemCtrl.prototype.restoreUserSemesters = function () {
            var _this = this;
            this.userService.schedules.$promise.then(function (schedules) {
                var tempSemesters = [];
                angular.forEach(schedules, function (schedule) {
                    if (!_this._semesterInArray(schedule.semester, tempSemesters)) {
                        tempSemesters.push(schedule.semester);
                    }
                });

                tempSemesters.sort(Semester.compare);
                angular.forEach(tempSemesters, function (semester) {
                    if (!_this._semesterInArray(semester, _this.semesters)) {
                        semester.active = true;
                        semester.current = semester.term_code >= SemCtrl.CURRENT_SEMESTER_TERM_CODE;
                        _this.addSemester(semester);
                    }
                });
            });
        };

        SemCtrl.prototype._semesterInArray = function (semester, array) {
            var found = false;
            angular.forEach(array, function (sem) {
                if (sem.term_code == semester.term_code) {
                    found = true;
                    return false;
                }
            });

            return found;
        };

        SemCtrl.prototype.setAllInactive = function () {
            angular.forEach(this.semesters, function (semester) {
                semester.active = false;
            });
        };

        SemCtrl.prototype.canAdd = function () {
            return this.getNewSemesterTermCode() <= SemCtrl.LAST_AVAILABLE_TERM_CODE;
        };

        // TODO: this will only give you semesters after
        // the last existing semester
        // for example, if the only semester the user has is 1415Fall,
        // he will not be able to add semesters from previous years
        SemCtrl.prototype.getNewSemesterTermCode = function () {
            if (this.semesters.length == 0) {
                return SemCtrl.CURRENT_SEMESTER_TERM_CODE;
            }

            var lastTermCode = +this.semesters[this.semesters.length - 1].term_code;
            if (this.semesterIsFall(lastTermCode)) {
                // fall to spring, from 2 to 4
                return lastTermCode + 2;
            } else {
                // spring to fall, from 4 to 12
                return lastTermCode + 8;
            }
        };

        SemCtrl.prototype.getNextSemester = function () {
            var term_code = this.getNewSemesterTermCode();
            return this.semesterService.getByTermCode(term_code);
        };

        SemCtrl.prototype.addNewSemester = function (semester) {
            var _this = this;
            if (semester) {
                this.semesters.push(semester);
            } else {
                this.getNextSemester().then(function (semester) {
                    if (!_this._semesterInArray(semester, _this.semesters)) {
                        semester.active = true;
                        semester.current = semester.term_code >= SemCtrl.CURRENT_SEMESTER_TERM_CODE;
                        _this.semesters.push(semester);
                    }
                });
            }
        };

        SemCtrl.prototype.getTitle = function (termCode) {
            // take mid 2 numbers: _XX_ for year
            var endYear = Math.floor((termCode % 1000) / 10);
            var startYear = endYear - 1;
            var semester = this.semesterIsFall(termCode) ? "Fall" : "Spring";
            return "" + startYear + "-" + endYear + " " + semester;
        };

        SemCtrl.prototype.addSemester = function (semester) {
            this.setAllInactive();
            this.addNewSemester(semester);
        };

        // term codes for the fall semester ends with 2
        // '''''''''''''''''''spring semester ends with 4
        SemCtrl.prototype.semesterIsFall = function (termCode) {
            return termCode % 10 == 2;
        };
        SemCtrl.$inject = [
            '$scope',
            'localStorageService',
            'UserService',
            'SemesterService'
        ];

        SemCtrl.CURRENT_SEMESTER_TERM_CODE = 1152;
        SemCtrl.LAST_AVAILABLE_TERM_CODE = 1154;
        return SemCtrl;
    })();

    
    return SemCtrl;
});

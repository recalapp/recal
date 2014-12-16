/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports", '../models/Semester'], function(require, exports, Semester) {
    var SemCtrl = (function () {
        function SemCtrl($scope, localStorageService) {
            this.$scope = $scope;
            this.localStorageService = localStorageService;
            this.$scope.vm = this;
            this.$scope.userData = this.$scope.$parent.data;
            this.semesters = [];
            this.restoreUserSemesters();
            this.$scope.semesters = this.semesters;
            this.$scope.canAdd = this.canAdd();
        }
        SemCtrl.prototype.restoreUserSemesters = function () {
            var _this = this;
            this.$scope.userData.schedules.$promise.then(function (schedules) {
                var tempSemesters = [];
                angular.forEach(schedules, function (schedule) {
                    if (!_this.semesterInArray(schedule.semester, tempSemesters)) {
                        tempSemesters.push(schedule.semester);
                    }
                });

                tempSemesters.sort(Semester.compare);
                angular.forEach(tempSemesters, function (semester) {
                    if (!_this.semesterInArray(semester, _this.semesters)) {
                        _this.addSemester(new Semester(semester.name, true, semester.term_code >= SemCtrl.CURRENT_SEMESTER_TERM_CODE, semester.term_code));
                    }
                });
            });
        };

        SemCtrl.prototype.semesterInArray = function (semester, semesters) {
            var found = false;
            angular.forEach(semesters, function (sem) {
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
        SemCtrl.prototype.getNewSemesterTermCode = function () {
            if (this.semesters.length == 0) {
                return SemCtrl.CURRENT_SEMESTER_TERM_CODE;
            }

            var lastTermCode = this.semesters[this.semesters.length - 1].term_code;
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
            return new Semester(this.getTitle(term_code), true, term_code >= SemCtrl.CURRENT_SEMESTER_TERM_CODE, term_code);
        };

        SemCtrl.prototype.addNewSemester = function (semester) {
            if (semester) {
                this.semesters.push(semester);
            } else {
                this.semesters.push(this.getNextSemester());
            }
        };

        SemCtrl.prototype.getTitle = function (termCode) {
            // take mid 2 numbers: _XX_
            var endYear = Math.floor((termCode % 1000) / 10);
            var startYear = endYear - 1;
            var semester = this.semesterIsFall(termCode) ? "Fall" : "Spring";
            return "" + startYear + "-" + endYear + " " + semester;
        };

        SemCtrl.prototype.addSemester = function (semester) {
            this.setAllInactive();
            this.addNewSemester(semester);
            this.$scope.canAdd = this.canAdd();
        };

        SemCtrl.prototype.semesterIsFall = function (termCode) {
            return termCode % 10 == 2;
        };
        SemCtrl.$inject = [
            '$scope',
            'localStorageService'
        ];

        SemCtrl.CURRENT_SEMESTER_TERM_CODE = 1152;
        SemCtrl.LAST_AVAILABLE_TERM_CODE = 1154;
        return SemCtrl;
    })();

    
    return SemCtrl;
});

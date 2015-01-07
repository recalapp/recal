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

            this._initSemesters();
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
        SemCtrl.prototype._initSemesters = function () {
            var _this = this;
            this.semesterService.allSemesters().$promise.then(function (semesters) {
                semesters.sort(Semester.compare);
                angular.forEach(semesters, function (semester) {
                    if (!_this._semesterInArray(semester, _this.semesters)) {
                        semester.active = true;
                        semester.current = semester.term_code >= SemCtrl.CURRENT_SEMESTER_TERM_CODE;
                        if (semester.current) {
                            _this.addSemester(semester);
                        }
                    }
                });
            });
        };

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

        SemCtrl.prototype.getNewSemesterTermCode = function () {
            if (this.semesters.length == 0) {
                return SemCtrl.CURRENT_SEMESTER_TERM_CODE;
            }

            var lastTermCode = +this.semesters[this.semesters.length - 1].term_code;
            if (this.semesterIsFall(lastTermCode)) {
                return lastTermCode + 2;
            } else {
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
            var endYear = Math.floor((termCode % 1000) / 10);
            var startYear = endYear - 1;
            var semester = this.semesterIsFall(termCode) ? "Fall" : "Spring";
            return "" + startYear + "-" + endYear + " " + semester;
        };

        SemCtrl.prototype.addSemester = function (semester) {
            this.setAllInactive();
            this.addNewSemester(semester);
        };

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
//# sourceMappingURL=SemCtrl.js.map

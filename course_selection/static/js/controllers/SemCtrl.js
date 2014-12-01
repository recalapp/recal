/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports"], function(require, exports) {
    var SemCtrl = (function () {
        function SemCtrl($scope) {
            this.$scope = $scope;
            this.$scope.vm = this;
            this.semesters = [];
            this.$scope.semesters = this.semesters;
            this.$scope.canAdd = this.canAdd();
        }
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
                return 1152;
            }

            var lastTermCode = this.semesters[this.semesters.length - 1].term_code;
            if (this.semesterIsFall(lastTermCode)) {
                // fall to spring
                return lastTermCode + 2;
            } else {
                // spring to fall
                return lastTermCode + 8;
            }
        };

        SemCtrl.prototype.addNewSemester = function () {
            var id = this.semesters.length + 1;
            var term_code = this.getNewSemesterTermCode();
            var title = this.getTitle(term_code);
            this.semesters.push({
                id: id,
                title: title,
                active: true,
                current: term_code >= 1152 ? true : false,
                term_code: term_code
            });

            this.$scope.canAdd = this.canAdd();
        };

        SemCtrl.prototype.getTitle = function (termCode) {
            var endYear = Math.floor((termCode % 1000) / 10);
            var startYear = endYear - 1;
            var semester = this.semesterIsFall(termCode) ? "Fall" : "Spring";
            return "" + startYear + endYear + semester;
        };

        SemCtrl.prototype.addSemester = function () {
            this.setAllInactive();
            this.addNewSemester();
        };

        SemCtrl.prototype.semesterIsFall = function (termCode) {
            return termCode % 10 == 2;
        };
        SemCtrl.$inject = [
            '$scope'
        ];

        SemCtrl.LAST_AVAILABLE_TERM_CODE = 1154;
        return SemCtrl;
    })();

    
    return SemCtrl;
});

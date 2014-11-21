/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports"], function(require, exports) {
    var SemCtrl = (function () {
        function SemCtrl($scope) {
            this.$scope = $scope;
            this.$scope.vm = this;
            this.semesters = [];
            this.$scope.semesters = this.semesters;
        }
        SemCtrl.prototype.setAllInactive = function () {
            angular.forEach(this.semesters, function (semester) {
                semester.active = false;
            });
        };

        SemCtrl.prototype.addNewSemester = function () {
            var id = this.semesters.length + 1;
            var term_code;
            if (this.semesters.length > 0)
                term_code = this.semesters[this.semesters.length - 1].term_code + 10;
            else {
                term_code = 1132;
            }

            var title = this.getTitle(term_code);
            this.semesters.push({
                id: id,
                title: title,
                active: true,
                current: term_code >= 1152 ? true : false,
                term_code: term_code
            });
        };

        SemCtrl.prototype.getTitle = function (termCode) {
            var endYear = Math.floor((termCode % 1000) / 10);
            var startYear = endYear - 1;
            var semester = (termCode % 10) == 2 ? "Fall" : "Spring";
            return "" + startYear + endYear + semester;
        };

        SemCtrl.prototype.addSemester = function () {
            this.setAllInactive();
            this.addNewSemester();
        };
        SemCtrl.$inject = [
            '$scope'
        ];
        return SemCtrl;
    })();

    
    return SemCtrl;
});

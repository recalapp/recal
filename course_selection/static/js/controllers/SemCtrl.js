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
            this.semesters.push({
                id: id,
                title: term_code,
                active: true,
                term_code: term_code
            });
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
//# sourceMappingURL=SemCtrl.js.map

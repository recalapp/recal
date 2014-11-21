/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';

class SemCtrl {
    public static $inject =[
        '$scope',
        ];

    private semesters;

    constructor(private $scope) {
        this.$scope.vm = this;
        this.semesters = [];
        this.$scope.semesters = this.semesters;
    }

    public setAllInactive() {
        angular.forEach(this.semesters, (semester) => {
            semester.active = false;
        });
    }
 
    private addNewSemester() {
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
    }

    private getTitle(termCode: number): string {
        var endYear = Math.floor((termCode % 1000) / 10);
        var startYear = endYear - 1;
        var semester = (termCode % 10) == 2 ? "Fall" : "Spring";
        return "" + startYear + endYear + semester;
    }
 
    public addSemester() {
        this.setAllInactive();
        this.addNewSemester();
    }    
}

export = SemCtrl;

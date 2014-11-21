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
        this.semesters.push({
            id: id,
            title: term_code,
            active: true,
            term_code: term_code
        });
    }
 
    public addSemester() {
        this.setAllInactive();
        this.addNewSemester();
    }    
}

export = SemCtrl;

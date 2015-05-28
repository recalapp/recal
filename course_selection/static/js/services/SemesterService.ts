/// <reference path='../../ts/typings/tsd.d.ts' />

'use strict';

class SemesterService {

    public static $inject = [
        'SemesterResource'
    ];

    constructor(private semesterResource) {
    }

    public allSemesters() {
        return this.semesterResource.query();
    }

    public getByTermCode(termCode: string) {
        return this.semesterResource.getByTermCode({term_code: termCode}).$promise;
    }
}

export = SemesterService;

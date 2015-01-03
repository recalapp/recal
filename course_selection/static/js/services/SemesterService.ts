/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import Service = require('./Service');

'use strict';

class SemesterService {

    public static $inject = [
        'SemesterResource'
    ];

    constructor(private semesterResource) {
    }

    public getByTermCode(termCode: string) {
        return this.semesterResource.getByTermCode({term_code: termCode}).$promise;
    }
}

export = SemesterService;

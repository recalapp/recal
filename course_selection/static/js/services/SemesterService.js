/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var SemesterService = (function () {
        function SemesterService(semesterResource) {
            this.semesterResource = semesterResource;
        }
        SemesterService.prototype.getByTermCode = function (termCode) {
            return this.semesterResource.getByTermCode({ term_code: termCode }).$promise;
        };
        SemesterService.$inject = [
            'SemesterResource'
        ];
        return SemesterService;
    })();

    
    return SemesterService;
});

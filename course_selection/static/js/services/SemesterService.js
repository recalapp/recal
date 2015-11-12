/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';
define(["require", "exports"], function (require, exports) {
    var SemesterService = (function () {
        function SemesterService(semesterResource) {
            this.semesterResource = semesterResource;
        }
        SemesterService.prototype.allSemesters = function () {
            return this.semesterResource.query();
        };
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
//# sourceMappingURL=SemesterService.js.map
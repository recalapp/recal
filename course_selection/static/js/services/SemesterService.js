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
//# sourceMappingURL=SemesterService.js.map

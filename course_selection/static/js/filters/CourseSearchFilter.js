var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Filter'], function(require, exports, Filter) {
    var CourseSearchFilter = (function (_super) {
        __extends(CourseSearchFilter, _super);
        function CourseSearchFilter() {
            _super.apply(this, arguments);
        }
        CourseSearchFilter.Factory = function () {
            return function (input) {
                return true;
            };
        };
        return CourseSearchFilter;
    })(Filter);

    
    return CourseSearchFilter;
});
//# sourceMappingURL=CourseSearchFilter.js.map

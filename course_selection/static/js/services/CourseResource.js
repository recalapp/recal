var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Service'], function(require, exports, Service) {
    'use strict';

    var CourseResource = (function (_super) {
        __extends(CourseResource, _super);
        function CourseResource($resource) {
            _super.call(this);
            this.$resource = $resource;
        }
        CourseResource.prototype.query = function () {
        };

        CourseResource.prototype.get = function () {
        };

        CourseResource.prototype.put = function (courses) {
        };
        CourseResource.$inject = ['$resource'];
        return CourseResource;
    })(Service);

    
    return CourseResource;
});
//# sourceMappingURL=CourseResource.js.map

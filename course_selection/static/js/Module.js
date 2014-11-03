'use strict';
define(["require", "exports", "angular"], function(require, exports) {
    var Module = (function () {
        function Module(name, modules) {
            this.app = angular.module(name, modules);
        }
        Module.prototype.addController = function (name, controller) {
            this.app.controller(name, controller);
        };

        Module.prototype.addService = function (name, service) {
            this.app.service(name, service);
        };

        Module.prototype.addFilter = function (name, filter) {
            this.app.filter(name, filter);
        };
        return Module;
    })();

    
    return Module;
});
//# sourceMappingURL=Module.js.map

define(["require", "exports"], function(require, exports) {
    var TestSharingService = (function () {
        function TestSharingService() {
            this.data = "";
        }
        TestSharingService.prototype.update = function (input) {
            this.data = input;
        };
        TestSharingService.$inject = [];
        return TestSharingService;
    })();

    
    return TestSharingService;
});
//# sourceMappingURL=TestSharingService.js.map

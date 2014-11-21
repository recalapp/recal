define(["require", "exports"], function(require, exports) {
    'use strict';

    var QueueCtrl = (function () {
        function QueueCtrl($scope, testSharingService) {
            this.$scope = $scope;
            this.testSharingService = testSharingService;
            this.$scope.vm = this;
            this.$scope.data = testSharingService.getData();
        }
        QueueCtrl.prototype.onMouseOver = function (section) {
            if (this.testSharingService.isSectionEnrolled(section)) {
            } else {
                this.testSharingService.setPreviewSection(section);
            }
        };

        QueueCtrl.prototype.onClick = function (section) {
            if (this.testSharingService.isSectionEnrolled(section)) {
                this.testSharingService.unenrollSection(section);
            } else {
                this.testSharingService.enrollSection(section);
            }
        };

        QueueCtrl.prototype.setColor = function (course) {
            if (course.colors == null) {
                return {};
            } else {
                return {
                    'background-color': course.colors.dark,
                    'color': 'white'
                };
            }
        };
        QueueCtrl.$inject = [
            '$scope',
            'TestSharingService'
        ];
        return QueueCtrl;
    })();

    
    return QueueCtrl;
});
//# sourceMappingURL=QueueCtrl.js.map

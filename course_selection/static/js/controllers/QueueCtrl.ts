import ICourse = require('../interfaces/ICourse');
import TestSharingService = require('../services/TestSharingService');

'use strict';

class QueueCtrl {
    public static $inject = [
        '$scope',
        'TestSharingService'
        ];

    constructor(
            private $scope,
            private testSharingService
            )
    {
        this.$scope.vm = this;
        this.$scope.data = testSharingService.getData();
    }

    // section belongs to a course that has been enrolled
    public onMouseOver(section): void {
    }
}

export = QueueCtrl;

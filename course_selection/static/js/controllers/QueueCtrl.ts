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
}

export = QueueCtrl;

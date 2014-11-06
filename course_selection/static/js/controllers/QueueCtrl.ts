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

    private getPrimaryCourseListing(course: ICourse): string {
        for (var i = 0; i < course.course_listings.length; i++) {
            var curr = course.course_listings[i];
            if (curr.is_primary) {
                return curr.dept + curr.number;
            }
        }

        return "";
    }
}

export = QueueCtrl;

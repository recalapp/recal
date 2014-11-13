import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
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
    public onMouseOver(section: ISection): void {
        if (this.testSharingService.isSectionEnrolled(section)) {
            // nothing happens
        } else {
            this.testSharingService.setPreviewSection(section);
        }
    }

    public onClick(section: ISection): void {
        if (this.testSharingService.isSectionEnrolled(section)) {
            this.testSharingService.unenrollSection(section);
        } else {
            this.testSharingService.enrollSection(section);
        }
    }
}

export = QueueCtrl;

import ICourse = require('../interfaces/ICourse');

class TestSharingService {
    private previewEvents;
    private enrolledCourses;

    constructor() {
        this.previewEvents = [];
        this.enrolledCourses = [];
    }

    public setPreviewEvents(input) {
        this.previewEvents = input;
    }

    public getPreviewEvents() {
        return this.previewEvents;
    }

    public setEnrolledEvents(input) {
        this.enrolledCourses = input;
    }

    public getEnrolledCourses() {
        return this.enrolledCourses;
    }
}

export = TestSharingService;

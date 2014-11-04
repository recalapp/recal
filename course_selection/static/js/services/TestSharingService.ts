import ICourse = require('../interfaces/ICourse');

class TestSharingService {
    private previewEvents;
    private previewCourse;
    private enrolledCourses;

    constructor() {
        this.previewEvents = [];
        this.previewCourse = {};
        this.enrolledCourses = [];
    }

    public setPreviewEvents(input) {
        this.previewEvents = input;
    }

    public getPreviewEvents() {
        return this.previewEvents;
    }

    public setPreviewCourse(course) { 
        this.previewCourse = course;
    }

    public getPreviewCourse() {
        return this.previewCourse;
    }

    public setEnrolledCourses(courses) {
        this.enrolledCourses = courses;
    }

    public getEnrolledCourses() {
        return this.enrolledCourses;
    }
}

export = TestSharingService;

import ICourse = require('../interfaces/ICourse');

class TestSharingService {
    private data = {
        foo: 'foo',
        bar: 'bar',
        previewCourse: {},
        enrolledCourses: []
    };

    constructor() {
        this.data.previewCourse = {};
        this.data.enrolledCourses = [];
    }

    public getData() {
        return this.data;
    }
}

export = TestSharingService;

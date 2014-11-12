import ICourse = require('../interfaces/ICourse');

class TestSharingService {
    private static NOT_FOUND: number = -1;

    private data = {
        foo: 'foo',
        bar: 'bar',
        previewCourse: null,
        enrolledCourses: []
    };

    constructor() {
        this.data.previewCourse = null;
        this.data.enrolledCourses = [];
    }

    public getData() {
        return this.data;
    }

    public setPreviewCourse(course: ICourse): void {
        this.data.previewCourse = course;
    }

    public clearPreviewCourse(): void {
        this.setPreviewCourse(null);
    }

    public enrollCourse(course: ICourse): void {
        this.data.enrolledCourses.push(course);
    }

    public unenrollCourse(course: ICourse): void {
        var enrolledCourses = this.data.enrolledCourses;
        var idx = this.courseIdxInList(course, enrolledCourses);
        enrolledCourses.splice(idx, 1);
    }

    private courseIdxInList(course, list) {
        for (var i = 0; i < list.length; i++) {
            if (course.id == list[i].id) {
                return i;
            }
        }

        return TestSharingService.NOT_FOUND;
    }
    
    public isCourseEnrolled(course: ICourse): boolean {
        var idx = this.courseIdxInList(course, this.data.enrolledCourses);
        return idx != TestSharingService.NOT_FOUND;
    }



    /////////////////////////////////////////////////////////////////////
    // TODO: these should be moved to a class called Course that 
    // implements ICourse
    public getPrimaryCourseListing(course: ICourse): string {
        for (var i = 0; i < course.course_listings.length; i++) {
            var curr = course.course_listings[i];
            if (curr.is_primary) {
                return curr.dept + curr.number;
            }
        }

        return "";
    }

    public getAllCourseListings(course: ICourse): string {
        if (!course) {
            console.log("getAllCourseListings's input is " + course);
            return '';
        }

        var listings = [];
        for (var i = 0; i < course.course_listings.length; i++) {
            var curr = course.course_listings[i];
            if (curr.is_primary) {
                listings.unshift(curr.dept + curr.number);
            } else {
                listings.push(curr.dept + curr.number);
            }
        }

        return listings.join(' / ');
    }
}

export = TestSharingService;

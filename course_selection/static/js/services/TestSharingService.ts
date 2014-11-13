import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');

class TestSharingService {
    private static NOT_FOUND: number = -1;

    /* maybe this service shouldn't know about any course/section being previewed? */
    private data = {
        previewCourse: null,
        enrolledCourses: [],
        previewSection: null,
        enrolledSections: null
    };

    private preview = {
        course: null,
        section: null
    }

    constructor() {
        this.data.previewCourse = null;
        this.data.enrolledCourses = [];
        this.data.enrolledSections = {};
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

        // example--
        // enrolledSections:
        // {
        //      1: {
        //          LEC: null,
        //          PRE: null
        //      },
        //      2: {
        //          STU: 01,
        //          CLA: null
        //      }
        // }
        this.data.enrolledSections[course.id] = {};
        for (var i = 0; i < course.section_types.length; i++) {
            var section_type = course.section_types[i];
            this.data.enrolledSections[course.id][section_type] = null;
        }
    }

    public unenrollCourse(course: ICourse): void {
        var enrolledCourses = this.data.enrolledCourses;
        var idx = this.courseIdxInList(course, enrolledCourses);
        enrolledCourses.splice(idx, 1);
    }

    public setPreviewSection(section: ISection): void {
    }

    public clearPreviewSection(section: ISection): void {
    }

    public enrollSection(section: ISection): void {
        this.data.enrolledSections[section.course_id][section.section_type] = section.id;
    }

    public unenrollSection(section: ISection): void {
        this.data.enrolledSections[section.course_id][section.section_type] = null;
    }

    public isSectionEnrolled(section: ISection): boolean {
        var enrolledCourse = this.data.enrolledSections[section.course_id];
        return enrolledCourse != null
            && enrolledCourse[section.section_type] == section.id;
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
}

export = TestSharingService;

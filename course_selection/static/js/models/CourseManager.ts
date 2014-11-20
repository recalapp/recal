import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import CourseResource = require('../services/CourseResource');
import Course = require('./Course');

class CourseManager {
    private static NOT_FOUND: number = -1;

    private data = {
        previewCourse: null,
        enrolledCourses: [],
        previewSection: null,
        enrolledSections: null,
        courses: []
    };

    private preview = {
        course: null,
        section: null
    }

    constructor(
            private courseResource,
            private localStorageService,
            private termCode: number
            ) {
        this.data.previewCourse = null;
        this.data.enrolledCourses = [];
        this.data.enrolledSections = {};
        this.loadCourses();
    }

    private loadCourses() {
        var temp = this.localStorageService.get('courses-' + this.termCode);
        if (temp != null && Array.isArray(temp)) {
            this.data.courses = temp;
        } else {
            this.courseResource.get(
                    { semester__term_code: this.termCode }, 
                    (data) => {
                        this.onLoaded(data);
                    }
            );
        }
    }

    private onLoaded(data) {
        this.data.courses = data['objects'].map((course) => {
            return new Course(
                    course.title,
                    course.description,
                    course.course_listings,
                    course.id,
                    course.sections,
                    course.semester
                    );
        });

        this.localStorageService.set('courses-' + this.termCode, this.data.courses);
    }

    public getData() {
        return this.data;
    }

    ///////////////////////////////////////////////////////////
    // Course Management
    //////////////////////////////////////////////////////////
    public getCourseById(id: number): ICourse {
        return this.data.courses.filter((course) => {
                    return course.id == id;
                })[0];
    }

    ///////////////////////////////////////////////////////////
    // Course Enrollment Management
    //////////////////////////////////////////////////////////

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

        this.data.enrolledSections[course.id] = null;
    }

    private courseIdxInList(course, list) {
        for (var i = 0; i < list.length; i++) {
            if (course.id == list[i].id) {
                return i;
            }
        }

        return CourseManager.NOT_FOUND;
    }
    
    public isCourseEnrolled(course: ICourse): boolean {
        var idx = this.courseIdxInList(course, this.data.enrolledCourses);
        return idx != CourseManager.NOT_FOUND;
    }

    ///////////////////////////////////////////////////////////
    // Section Enrollment Management
    //////////////////////////////////////////////////////////
    
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

}

export = CourseManager;

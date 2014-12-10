import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import CourseResource = require('../services/CourseResource');
import Course = require('./Course');
import IColorManager = require('../interfaces/IColorManager');

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
            private scheduleResource,
            private localStorageService,
            private colorManager: IColorManager,
            private termCode: number
            ) {
        this.data.previewCourse = null;
        this.data.enrolledCourses = [];
        this.data.enrolledSections = {};
        this.loadCourses();
    }

    ///////////////////////////////////////////////////////////
    // Initialization
    //////////////////////////////////////////////////////////
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

    // TODO: verify that the transformresponse function works as intended
    private onLoaded(courses) {
        this.data.courses = courses.map((course) => {
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
        // remove from all courses
        var idx = this.courseIdxInList(course, this.data.courses);
        this.data.courses.splice(idx, 1);

        course.colors = this.colorManager.nextColor();

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

        // if there's only one option for section_type, automatically
        // enroll in it
        //for (var i = 0; i < course.section_types.length; i++) {
        //    var section_type = course.section_types[i];
        //    var sectionsOfType = course.sections.filter((section) => {
        //        return section.section_type == section_type;
        //    });

        //    if (sectionsOfType.length == 0) {
        //        console.log('course ' + course.id + ' has no sections of type '
        //                + section_type);
        //    } else if (sectionsOfType.length == 1) {
        //        this.enrollSection(sectionsOfType[0]);
        //    }
        //}

        for (var i = 0; i < course.sections.length; i++) {
            if (!course.sections[i].has_meetings) {
                this.enrollSection(course.sections[i]);
            }
        }
    }

    public unenrollCourse(course: ICourse): void {
        // remove from enrolled courses
        this.removeFromList(course, this.data.enrolledCourses);

        // remove enrolled sections for this course
        this.data.enrolledSections[course.id] = null;

        // remove data set in the course object
        this.colorManager.addColor(course.colors);
        course.colors = null;

        // add to unenrolled courses
        this.data.courses.push(course);
    }

    private removeFromList(course, list): void {
        var idx = this.courseIdxInList(course, list);
        list.splice(idx, 1);
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

        // try posting data here
        //this.data.enrolledSections.$save();
    }

    public isCourseAllSectionsEnrolled(course: ICourse): boolean {
        var allSectionsEnrolled = true;
        if (!this.isCourseEnrolled(course)) {
            return false;
        }

        var enrollments = this.data.enrolledSections[course.id];
        angular.forEach(enrollments, (value, key) => {
            // key is section_type, value is enrolled section id, if exists
            if (!value) {
                 allSectionsEnrolled = false;
                 return false;
            }
        });

        return allSectionsEnrolled;
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

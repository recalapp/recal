/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
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
            private $rootScope,
            private courseService,
            private localStorageService,
            private colorManager: IColorManager,
            private termCode: number
            ) 
    {
        this.init();
    }

    ///////////////////////////////////////////////////////////
    // Initialization
    //////////////////////////////////////////////////////////
    private init() {
        this.initData();
        this.initWatches();
    }

    private initData() {
        this.data.previewCourse = null;
        this.data.enrolledCourses = [];
        this.data.enrolledSections = {};
        this.loadCourses();
    }

    private initWatches() {
        this.$rootScope.$watch(() => {
            return this.data.enrolledSections;
        }, (newValue, oldValue) => {
            if (newValue === oldValue) {
                return;
            }

            console.log('test');
            // do stuff with syncing
            // this.data.enrolledCourses is up to date
        }, true);

    }

    // map raw data into more flexible data structure
    private transformCourse(rawCourse): ICourse {
        return new Course(
                rawCourse.title,
                rawCourse.description,
                rawCourse.course_listings,
                rawCourse.id,
                rawCourse.sections,
                rawCourse.semester
                );
    }

    private loadCourses() {
        this.courseService.getBySemester(this.termCode).then((courses) => {
            this.data.courses = courses.map(this.transformCourse); 
        });
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

    private _enrollCourse(course: ICourse): void {
        var idx = this.courseIdxInList(course, this.data.courses);
        this.data.courses.splice(idx, 1);

        course.colors = this.colorManager.nextColor();

        this.data.enrolledCourses.push(course);
    }

    private _enrollSections(course: ICourse): void {
        this.data.enrolledSections[course.id] = {};
        for (var i = 0; i < course.section_types.length; i++) {
            var section_type = course.section_types[i];
            this.data.enrolledSections[course.id][section_type] = null;
        }

        for (var i = 0; i < course.sections.length; i++) {
            if (!course.sections[i].has_meetings) {
                this.enrollSection(course.sections[i]);
            }
        }
    }

    private _unenrollCourse(course: ICourse): void {
        // remove from enrolled courses
        this.removeFromList(course, this.data.enrolledCourses);

        // remove data set in the course object
        this.colorManager.addColor(course.colors);
        course.colors = null;

        // add to unenrolled courses
        this.data.courses.push(course);
    }

    private _unenrollSections(course: ICourse): void {
        this.data.enrolledSections[course.id] = null;
    }

    /**
     * NOTE: the input course is modified
     */
    public enrollCourse(course: ICourse): void {
        this._enrollCourse(course);
        this._enrollSections(course);
    }

    /**
     * NOTE: the input course is modified
     */
    public unenrollCourse(course: ICourse): void {
        this._unenrollCourse(course);
        this._unenrollSections(course);
    }

    private removeFromList(course, list): void {
        var idx = this.courseIdxInList(course, list);
        list.splice(idx, 1);
    }

    // TODO: this is a linear traversal. Optimize if this causes
    // performance issues
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

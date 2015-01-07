/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import Course = require('./Course');
import ColorManager = require('../models/ColorManager');
import IColorManager = require('../interfaces/IColorManager');
import IEnrollment = require('../interfaces/IEnrollment');

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

    private colorManager: IColorManager;

    constructor(
            private $rootScope,
            private courseService,
            private localStorageService,
            private colorResource,
            private schedule
            ) 
    {
        var prevEnrollments = schedule.enrollments ? JSON.parse(schedule.enrollments) : null;
        var availableColors = schedule.available_colors ? JSON.parse(schedule.available_colors) : null;
        this._initData(prevEnrollments);
        this._initColorManager(availableColors, prevEnrollments);
        this._initWatches();
    }

    ///////////////////////////////////////////////////////////
    // Initialization
    //////////////////////////////////////////////////////////

    private _initData(prevEnrollments: Array<IEnrollment>) {
        this.data.previewCourse = null;
        this.data.enrolledCourses = [];
        this.data.enrolledSections = {};

        this._loadCourses(prevEnrollments);
    }

    private _initColorManager(availableColors: Array<any>, prevEnrollments: Array<IEnrollment>) {
        this.colorManager = new ColorManager(this.colorResource, availableColors, prevEnrollments);

        if (!availableColors) {
            this.colorManager.availableColors.$promise.then((colors) => {
                this.schedule.available_colors = JSON.stringify(colors);
                this.schedule.$save();
            });
        }
    }

    private _initWatches() {
        this.$rootScope.$watch(() => {
            return this.data.enrolledSections;
        }, (newValue, oldValue) => {
            if (newValue === oldValue) {
                return;
            }

            var enrollments = this._constructEnrollments(newValue);
            this.schedule.enrollments = JSON.stringify(enrollments);
            this.schedule.$update().then((updatedSchedule) => {
                console.log('schedule updated');
            });
        }, true);

    }

    private _constructEnrollments(enrolledSections) {
        var enrollments = [];
        angular.forEach(enrolledSections, (courseEnrollment, courseId) => {
            var enrollment = {
                course_id: null, 
                color: null,
                sections: []
            };

            enrollment.course_id = +courseId;

            // TODO: is it dangerous to do this?
            // 1: there should be a better function than filter for the job
            // 2: what if course.colors changes? does that affect this enrollment object?
            enrollment.color = this.data.enrolledCourses.filter((course) => {
                return course.id == +courseId;
            })[0].colors;
            angular.forEach(courseEnrollment, (sectionId, sectionType) => {
                if (sectionId != null) {
                    enrollment.sections.push(sectionId);
                }
            });

            enrollments.push(enrollment);
        });

        return enrollments;
    }

    // map raw data into more flexible data structure
    private _transformCourse(rawCourse): ICourse {
        return new Course(
                rawCourse.title,
                rawCourse.description,
                rawCourse.course_listings,
                rawCourse.id,
                rawCourse.sections,
                rawCourse.semester
                );
    }

    private _loadCourses(prevEnrollments) {
        this.courseService.getBySemester(this.schedule.semester.term_code).then((courses) => {
            this.data.courses = courses.map(this._transformCourse); 
        }).then(() => {
            if (prevEnrollments) {
                // restore prevEnrollments here
                for (var i = 0; i < prevEnrollments.length; i++) {
                    var enrollment = prevEnrollments[i];
                    var course = this.getCourseById(enrollment.course_id);
                    course.colors = enrollment.color;
                    this._enrollCourse(course);
                    this._enrollSections(course, enrollment.sections);
                }
            }
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
        var idx = this._courseIdxInList(course, this.data.courses);
        this.data.courses.splice(idx, 1);
        this.data.enrolledCourses.push(course);
    }

    private _enrollSections(course: ICourse, sectionIds?: Array<number>): void {
        this.data.enrolledSections[course.id] = {};
        for (var i = 0; i < course.section_types.length; i++) {
            var section_type = course.section_types[i];
            this.data.enrolledSections[course.id][section_type] = null;
        }

        for (var i = 0; i < course.sections.length; i++) {
            var section = course.sections[i];
            if (!section.has_meetings) {
                if (this._isTheOnlySectionOfType(course, section)) {
                    this.enrollSection(section);
                }
            }

            if (this._isInList(section.id, sectionIds)) {
                this.enrollSection(section);
            }
        }
    }

    private _isTheOnlySectionOfType(course: ICourse, section: ISection) {
        var filtered = course.sections.filter((temp) => {
            return temp.section_type == section.section_type;
        });
        return filtered.length == 1 && filtered[0].id == section.id;
    }

    private _unenrollCourse(course: ICourse): void {
        this._removeCourseFromList(course, this.data.enrolledCourses);
        this.data.courses.push(course);
    }

    private _unenrollSections(course: ICourse): void {
        this.data.enrolledSections[course.id] = null;
        delete this.data.enrolledSections[course.id];
    }

    /**
     * NOTE: the input course is modified
     */
    public enrollCourse(course: ICourse): void {
        course.colors = this.colorManager.nextColor();
        this._enrollCourse(course);
        this._enrollSections(course);
    }

    /**
     * NOTE: the input course is modified
     */
    public unenrollCourse(course: ICourse): void {
        // remove color set in the course object
        this.colorManager.addColor(course.colors);
        course.resetColor();

        this._unenrollCourse(course);
        this._unenrollSections(course);
    }

    private _removeCourseFromList(course, list): void {
        var idx = this._courseIdxInList(course, list);
        list.splice(idx, 1);
    }

    // TODO: this is a linear traversal. Optimize if this causes
    // performance issues
    private _idxInList(element, list, comp?) {
        var idx = CourseManager.NOT_FOUND;
        var comp = comp ? comp : this._defaultComp;
        angular.forEach(list, (value, key) => {
            if (comp(element, value)) {
                idx = key;
                return;
            }
        });

        return idx;
    }

    private _defaultComp(a, b): boolean {
        return a == b;
    }

    private _isInList(element, list, comp?): boolean {
        return this._idxInList(element, list, comp) != CourseManager.NOT_FOUND;
    }

    private _courseComp(a: ICourse, b: ICourse): boolean {
        return a.id == b.id;
    }

    private _sectionComp(a: ISection, b: ISection): boolean {
        return a.id == b.id;
    }

    private _courseIdxInList(course, list): number {
        return this._idxInList(course, list, this._courseComp);
    }
    
    public isCourseEnrolled(course: ICourse): boolean {
        var idx = this._courseIdxInList(course, this.data.enrolledCourses);
        return idx != CourseManager.NOT_FOUND;
    }

    ///////////////////////////////////////////////////////////
    // Section Enrollment Management
    //////////////////////////////////////////////////////////
    
    public setPreviewSection(section: ISection): void {
    }

    public clearPreviewSection(section: ISection): void {
    }

    // private _enrollSection(courseId, sectionId, sectionType): void {
    //     this.data.enrolledSections[courseId][sectionType] = sectionId;
    // }

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

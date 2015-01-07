import ICourse = require('./ICourse');
import ISection = require('./ISection');

interface IScheduleManager {
    getData(): any;

    getCourseById(id: number): ICourse;

    setPreviewCourse(course: ICourse): void;
    clearPreviewCourse(): void;
    enrollCourse(course: ICourse): void;
    unenrollCourse(course: ICourse): void;
    isCourseEnrolled(course: ICourse): boolean;

    setPreviewSection(section: ISection): void;
    clearPreviewSection(): void;
    enrollSection(section: ISection): void;
    unenrollSection(section: ISection): void;
    isSectionEnrolled(section: ISection): boolean;
    isCourseAllSectionsEnrolled(course: ICourse): boolean;
}

export = IScheduleManager;

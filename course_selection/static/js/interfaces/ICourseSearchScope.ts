import Application = require('../Application');
import ICourse = require('../interfaces/ICourse');
import CourseManager = require('../models/CourseManager');
import SearchCtrl = require('../controllers/SearchCtrl');

interface ICourseSearchScope extends ng.IScope {
    message;
    courses: ICourse[];
    coursesData: any;
    data: any;
    vm: SearchCtrl;
    courseManager: CourseManager;
    onMouseOver(course: ICourse): void;
}

export = ICourseSearchScope;

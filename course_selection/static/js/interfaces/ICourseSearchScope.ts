import Application = require('../Application');
import ICourse = require('../interfaces/ICourse');
import ScheduleManager = require('../models/ScheduleManager');
import SearchCtrl = require('../controllers/SearchCtrl');

interface ICourseSearchScope extends ng.IScope {
    message;
    courses: ICourse[];
    coursesData: any;
    data: any;
    vm: SearchCtrl;
    scheduleManager: ScheduleManager;
    onMouseOver(course: ICourse): void;
}

export = ICourseSearchScope;

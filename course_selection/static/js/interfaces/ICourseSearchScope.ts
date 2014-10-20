import Application = require('../Application');
import Course = require('../models/Course');
import SearchCtrl = require('../controllers/SearchCtrl');

interface ICourseSearchScope extends ng.IScope {
    courses: Course[];
    vm: SearchCtrl;
}

export = ICourseSearchScope;

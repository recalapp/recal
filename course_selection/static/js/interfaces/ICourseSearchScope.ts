import Application = require('../Application');
import ICourse = require('../interfaces/ICourse');
import SearchCtrl = require('../controllers/SearchCtrl');

interface ICourseSearchScope extends ng.IScope {
    message;
    courses;
    vm: SearchCtrl;
}

export = ICourseSearchScope;

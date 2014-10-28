import SearchCtrl = require('../controllers/SearchCtrl');
interface ICourseSearchScope extends ng.IScope {
    message: any;
    courses: any;
    vm: SearchCtrl;
}
export = ICourseSearchScope;

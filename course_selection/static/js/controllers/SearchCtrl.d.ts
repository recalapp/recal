import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
declare class SearchCtrl {
    private $scope;
    private $resource;
    static $inject: string[];
    constructor($scope: ICourseSearchScope, $resource: ng.resource.IResourceService);
    public sayHello(): void;
}
export = SearchCtrl;

declare class CalendarCtrl {
    private $scope;
    private static defaultUiConfig;
    static $inject: string[];
    constructor($scope: any);
    private initConfig();
    private initEventSources();
}
export = CalendarCtrl;

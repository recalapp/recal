/// <reference path='../../ts/typings/tsd.d.ts' />

'use strict';

class SearchCtrl {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
    '$scope',
    '$sce',
    '$filter'
    ];

    private static NOT_FOUND: number = -1;
    public static whichSearchEnum = {
        COURSE_SEARCH: 0,
        FRIEND_SEARCH: 1
    };

    private static COURSE_SEARCH_PLACE_HOLDER = "Search Course";
    private static FRIEND_SEARCH_PLACE_HOLDER = "Search Friend";

    private whichSearch: number;
    private placeHolder: string;

    constructor(
        private $scope,
        private $sce,
        private $filter
        ) {
            this.$scope.vm = this;
            this.useCourseSearch();
        }

        public useFriendSearch() {
            this.whichSearch = SearchCtrl.whichSearchEnum.FRIEND_SEARCH;
            this.$scope.whichSearch = this.whichSearch;
            this.placeHolder = SearchCtrl.FRIEND_SEARCH_PLACE_HOLDER;
        }

        public useCourseSearch() {
            this.whichSearch = SearchCtrl.whichSearchEnum.COURSE_SEARCH;
            this.$scope.whichSearch = this.whichSearch;
            this.placeHolder = SearchCtrl.COURSE_SEARCH_PLACE_HOLDER;
        }

}

export = SearchCtrl;

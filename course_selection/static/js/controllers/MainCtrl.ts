/// <reference path='../../ts/typings/tsd.d.ts' />

'use strict';

declare var username: string;

class MainCtrl {
    public static $inject = [
        '$scope',
        '$mdSidenav',
        '$log'
    ];

    constructor(
            private $scope,
            private $mdSidenav,
            private $log
            )
    {
    }

    public toggleSidebar(navID: string) {
        this.$mdSidenav(navID)
        .toggle()
        .then(function () {
            this.$log.debug("toggle " + navID + " is done");
            });
    }

}

export = MainCtrl;

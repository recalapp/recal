/// <reference path='../../ts/typings/tsd.d.ts' />

'use strict';

declare var username: string;

class MainCtrl {
    public static $inject = [
        '$scope'
    ];

    constructor(private $scope)
    {
        console.log("Test");
        this.$scope.additionalSchedule = null;
    }
}

export = MainCtrl;

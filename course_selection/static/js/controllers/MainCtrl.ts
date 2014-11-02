/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

'use strict';

class MainCtrl {
    public static $inject = [
        '$scope'
        ];

    constructor(
            private $scope
            )
    {
        this.$scope.vm = this;
    }
}

export = MainCtrl;

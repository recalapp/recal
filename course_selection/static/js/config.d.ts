/// <reference path="../../../nice/static/ts/typings/tsd.d.ts" />
declare function staticPath(path: String): String;
declare function bowerPath(path: String): String;
declare module 'angular' {
    var angular: ng.IAngularStatic;
    export = angular;
}

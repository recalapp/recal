/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", './DashboardInitializer'], function (require, exports, DashboardInitializer) {
    var initializer = new DashboardInitializer();
    initializer.initialize();
});

define(["require", "exports", 'jquery', '../library/CoreUI/View', '../library/Testers/ViewTester'], function(require, exports, $, View, ViewTester) {
    $(function () {
        var viewTester = new ViewTester('View', new View($('<div>')));
        viewTester.run();
    });
});

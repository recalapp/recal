define(["require", "exports", 'jquery', '../library/CoreUI/View', '../library/Testers/ViewTester'], function(require, exports, $, View, ViewTester) {
    $(function () {
        try  {
            println('Starting unit tests');
            println('Testing View');

            var viewTester = new ViewTester('View', new View($('<div>')));
            viewTester.run();

            testsSucceeded();
        } catch (err) {
            testsFailed(err);
        }
    });

    function testsSucceeded() {
        println('Unit tests passed.');
    }

    function testsFailed(err) {
        println(err.toString());
    }

    function println(message) {
        $('#content').append($('<div>').text(message));
    }
});

define(["require", "exports", 'jquery', '../library/CoreUI/FocusableView', '../library/PopUp/PopUpView', '../library/CoreUI/View', '../library/Testers/ViewTester'], function(require, exports, $, FocusableView, PopUpView, View, ViewTester) {
    $(function () {
        try  {
            println('Starting unit tests');

            println('Testing View');
            var viewTester = new ViewTester('View', new View($('<div>')));
            viewTester.run();

            println('Testing FocusableView');
            viewTester = new ViewTester('FocusableView', new FocusableView($('<div>')));
            viewTester.run();

            println('Testing PopUpView');
            viewTester = new ViewTester('PopUpView', new PopUpView($('<div>')));
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

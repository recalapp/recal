define(["require", "exports", 'jquery', '../library/PopUp/PopUpContainerViewController', './TestPopUpView', '../library/CoreUI/View'], function(require, exports, $, PopUpContainerViewController, TestPopUpView, View) {
    var containerView = View.fromJQuery($('#content'));
    var containerVC = new PopUpContainerViewController(containerView);

    window.addPopUp = function () {
        var popUpView = TestPopUpView.fromJQuery($(popUpString));
        containerView.append(popUpView);
    };

    var $popUpTemplateContainer = $('#popup-template');
    var popUpString = $popUpTemplateContainer.children()[0];
    $popUpTemplateContainer.remove();

    window.addPopUp();
});

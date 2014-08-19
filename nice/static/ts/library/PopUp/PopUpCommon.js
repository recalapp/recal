define(["require", "exports"], function(require, exports) {
    var PopUpCommon = (function () {
        function PopUpCommon() {
        }
        PopUpCommon.cssClass = 'popup';
        PopUpCommon.cssSelector = '.' + PopUpCommon.cssClass;
        PopUpCommon.allDescendentsSelector = PopUpCommon.cssSelector + ' *';
        PopUpCommon.headingCssSelector = '.panel-heading';
        PopUpCommon.panelCssSelector = '.panel';
        PopUpCommon.focusOpacity = 1;
        PopUpCommon.blurOpacity = 0.6;
        PopUpCommon.focusClass = 'panel-primary';
        PopUpCommon.blurClass = 'panel-default';
        return PopUpCommon;
    })();

    
    return PopUpCommon;
});

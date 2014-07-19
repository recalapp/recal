define(["require", "exports"], function(require, exports) {
    exports.cssClass = 'popup';
    exports.cssSelector = '.' + exports.cssClass;
    exports.allDescendentsSelector = exports.cssSelector + ' *';
    exports.headingCssSelector = '.panel-heading';
    exports.panelCssSelector = '.panel';

    exports.focusOpacity = 1;
    exports.blurOpacity = 0.6;
    exports.focusClass = 'panel-primary';
    exports.blurClass = 'panel-default';
    (function (PopUpType) {
        PopUpType[PopUpType["main"] = 0] = "main";
        PopUpType[PopUpType["detached"] = 1] = "detached";
    })(exports.PopUpType || (exports.PopUpType = {}));
    var PopUpType = exports.PopUpType;
    ;

    function findPopUpElementFromChild($child) {
        while (!$child.hasClass(exports.cssClass)) {
            if ($child.length === 0) {
                // not found
                return null;
            }
            $child = $child.parent();
        }
        return $child;
    }
    exports.findPopUpElementFromChild = findPopUpElementFromChild;
});

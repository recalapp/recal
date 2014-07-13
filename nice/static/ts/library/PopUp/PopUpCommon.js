define(["require", "exports"], function(require, exports) {
    exports.CssClass = 'popup';
    exports.CssSelector = '.' + exports.CssClass;
    exports.AllDescendentsSelector = exports.CssSelector + ' *';
    exports.HeadingCssSelector = '.panel-heading';
    exports.PanelCssSelector = '.panel';

    exports.FocusOpacity = 1;
    exports.BlurOpacity = 0.6;
    exports.FocusClass = 'panel-primary';
    exports.BlurClass = 'panel-default';
    (function (PopUpType) {
        PopUpType[PopUpType["main"] = 0] = "main";
        PopUpType[PopUpType["detached"] = 1] = "detached";
    })(exports.PopUpType || (exports.PopUpType = {}));
    var PopUpType = exports.PopUpType;
    ;

    function findPopUpFromChild($child) {
        while (!$child.hasClass(exports.CssClass)) {
            if ($child.length === 0) {
                // not found
                return null;
            }
            $child = $child.parent();
        }
        return $child;
    }
    exports.findPopUpFromChild = findPopUpFromChild;
});

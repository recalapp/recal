/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CoreUI/View'], function(require, exports, View) {
    var SidebarFullViewContainer = (function (_super) {
        __extends(SidebarFullViewContainer, _super);
        function SidebarFullViewContainer($element) {
            _super.call(this, $element);
            this.removeAllChildren();
        }
        return SidebarFullViewContainer;
    })(View);

    
    return SidebarFullViewContainer;
});

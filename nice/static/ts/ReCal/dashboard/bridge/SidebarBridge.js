/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', '../../../library/Sidebar/SidebarView'], function(require, exports, $, SidebarView) {
    var sidebar = null;
    var count = 0;

    function SB_init() {
        sidebar = SidebarView.fromJQuery($('#sidebar-container'));
    }

    function SB_push(content) {
        //sidebar.pushStackViewWithIdentifier(content, ++count.toString());
    }

    function SB_pop(content) {
    }

    function SB_setMainContent(content) {
    }
});

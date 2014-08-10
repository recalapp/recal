/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import Sidebar = require('../../../library/Sidebar/Sidebar');
import SidebarView = require('../../../library/Sidebar/SidebarView');

import ISidebarView = Sidebar.ISidebarView;

var sidebar: ISidebarView = null;
var count = 0;

function SB_init()
{
    sidebar = <SidebarView> SidebarView.fromJQuery($('#sidebar-container'));
}

function SB_push(content: Element): void
{
    //sidebar.pushStackViewWithIdentifier(content, ++count.toString());
}

function SB_pop(content: Element): void
{
}

function SB_setMainContent(content: Element): void
{
}

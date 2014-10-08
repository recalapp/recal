/// <reference path="../../../typings/tsd.d.ts" />

import $ = require('jquery');

import Settings = require('./Settings');
import SettingsView = require('./SettingsView');
import ViewController = require('../../../library/CoreUI/ViewController');

class SettingsViewController extends ViewController
{
    constructor(view: SettingsView, dependencies: Settings.SettingsViewControllerDependencies)
    {
        super(view);
    }
}

export = SettingsViewController;
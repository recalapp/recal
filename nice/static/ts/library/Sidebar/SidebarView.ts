/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import CoreUI = require('../CoreUI/CoreUI');
import Sidebar = require('./Sidebar');
import SidebarFullViewContainer = require('./SidebarFullViewContainer');
import SidebarStackViewContainer = require('./SidebarStackViewContainer');
import View = require('../CoreUI/View');

import IView = CoreUI.IView;
import ISidebarView = Sidebar.ISidebarView;

class SidebarView extends View implements ISidebarView
{
    private _fullViewContainer: SidebarFullViewContainer = null;
    private _stackViewContainer: SidebarStackViewContainer = null;

    private get fullViewContainer(): SidebarFullViewContainer
    {
        return this._fullViewContainer;
    }

    private set fullViewContainer(value: SidebarFullViewContainer)
    {
        this._fullViewContainer = value;
    }

    private get stackViewContainer(): SidebarStackViewContainer
    {
        return this._stackViewContainer;
    }

    private set stackViewContainer(value: SidebarStackViewContainer)
    {
        this._stackViewContainer = value;
    }

    constructor($element: JQuery)
    {
        super($element);
        var $stack = this._$el.find('#sb-left-container');
        this.stackViewContainer = <SidebarStackViewContainer> SidebarStackViewContainer.fromJQuery($stack);
        var $full = this._$el.find('#sb-full-container');
        this.fullViewContainer = <SidebarFullViewContainer> SidebarFullViewContainer.fromJQuery($full);
    }

    /********************************************************************
      Stack View
      ******************************************************************/
    /**
      * pushes the view into the view stack if the identitifer does not
      * already exists. Otherwise, replace the old view.
      */
    public pushStackViewWithIdentifier(stackView: IView, identifier: string): void
    {
        this.stackViewContainer.addOrReplaceViewWithIdentifier(<View> stackView, identifier);
    }
    
    /**
      * Returns true of a view with the identifier already exists.
      */
    public containsStackViewWithIdentifier(identifier: string): boolean
    {
        return this.stackViewContainer.containsViewWithIdentifier(identifier);
    }
    
    /**
      * Returns the view with identifier. null if does not exist.
      */
    public getStackViewWithIdentifier(identifier: string): IView
    {
        return this.getStackViewWithIdentifier(identifier);
    }

    /**
      * Remove the view with identifier and return it. Throws an exception
      * if does not exist
      */
    public popStackViewWithIdentifier(identifier: string): IView
    {
        var view = this.getStackViewWithIdentifier(identifier);
        this.stackViewContainer.removeViewWithIdentifier(identifier);
        return view;
    }

    /********************************************************************
      Full View
      ******************************************************************/
    /**
      * Sets a view to be the full view, replacing the old one
      * if necessary.
      */
    public setFullView(fullView: IView): void
    {

    }
    
    /**
      * Returns true if a full view has been set.
      */
    public containsFullView(): boolean
    {
        return false;
    }

    /**
      * Retrieves the full view. null if does not exist.
      */
    public getFullView(): IView
    {
        return null;
    }

    /**
      * Unset the full view and return it. null if does not exist.
      */
    public unsetFullView(): IView
    {
        return null;
    }

    /********************************************************************
      Droppable Behavior
      ******************************************************************/    

    /**
      * Registers view with the css selector to receive droppable events
      */
    public registerDroppable(cssSelector: string): void
    {
        
    }
}

export = SidebarView;

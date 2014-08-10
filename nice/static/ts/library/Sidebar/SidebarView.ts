/// <reference path="../../typings/tsd.d.ts" />

/// <amd-dependency path="jqueryui" />
import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import CoreUI = require('../CoreUI/CoreUI');
import Set = require('../DataStructures/Set');
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
    private _droppableCssSelectors: Set<string> = new Set<string>();
    private _$sidebar: JQuery = null;

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

    private get droppableCssSelectorsString(): string
    {
        return this._droppableCssSelectors.toArray().join();
    }

    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);
        this._$sidebar = this._$el.find('#sidebar');
        var $stack = this._$el.find('#sb-left-container');
        this.stackViewContainer = <SidebarStackViewContainer> SidebarStackViewContainer.fromJQuery($stack);
        var $full = this._$el.find('#sb-full-container');
        this.fullViewContainer = <SidebarFullViewContainer> SidebarFullViewContainer.fromJQuery($full);

        // droppable
        this._$sidebar.droppable({
            drop: (ev: JQueryEventObject, ui: Element)=>{
                var $ui = $(ui);
                if ($ui.is(this.droppableCssSelectorsString))
                {
                    View.fromJQuery($ui).triggerEvent(BrowserEvents.sidebarViewDidDrop);
                }
            },
            hoverClass: 'hover-active'
        });
    }

    private showSidebar(): void
    {
        this._$sidebar.addClass('in');
        this._$el.find('#sb-handle').find('.glyphicon').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
    }

    private showSidebarFull(): void
    {
        this.showSidebar();
        this._$sidebar.addClass('full');
    }
    private hideSidebarFull(): void
    {
        this._$sidebar.removeClass('full');
        this.hideSidebarIfEmpty();
    }

    private hideSidebar(): void
    {
        this.triggerEvent(BrowserEvents.sidebarWillHide);
        this._$sidebar.removeClass('in');
        this._$el.find('#sb-handle').find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
    }

    private hideSidebarIfEmpty(): void
    {
        if (this.isEmpty)
        {
            this.hideSidebar();
        }
    }

    private get isEmpty(): boolean
    {
        return !this.fullViewContainer.hasView() && this.stackViewContainer.isEmpty;
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
        this.fullViewContainer.setView(<View> fullView);
    }
    
    /**
      * Returns true if a full view has been set.
      */
    public containsFullView(): boolean
    {
        return this.fullViewContainer.hasView();
    }

    /**
      * Retrieves the full view. null if does not exist.
      */
    public getFullView(): IView
    {
        return this.fullViewContainer.getView();
    }

    /**
      * Unset the full view and return it. null if does not exist. Throws
      * an exception if none has been set
      */
    public unsetFullView(): void
    {
        this.fullViewContainer.unsetView();
    }

    /********************************************************************
      Droppable Behavior
      ******************************************************************/    

    /**
      * Registers view with the css selector to receive droppable events
      */
    public registerDroppable(cssSelector: string): void
    {
        this._droppableCssSelectors.add(cssSelector);
    }
}

export = SidebarView;

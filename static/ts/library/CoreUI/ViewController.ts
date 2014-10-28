/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import CoreUI = require('./CoreUI');
import InvalidActionException = require('../Core/InvalidActionException');
import Set = require('../DataStructures/Set');

import IView = CoreUI.IView;
import IViewController = CoreUI.IViewController;

class ViewController implements IViewController
{
    private static _viewControllerCount = 0; // Used to make sure toString() is unique
    private _viewControllerNumber: number;
    _view: IView = null;
    _parentViewController: ViewController = null;
    _childViewControllers: Set<ViewController> = new Set<ViewController>();

    /******************************************************************
      Properties
      ****************************************************************/
    public get view() : IView
    {
        return this._view;
    }

    public get parentViewController() : ViewController
    {
        return this._parentViewController;
    }

    public get childViewControllers() : ViewController[]
    {
        return this._childViewControllers.toArray();
    }

    /******************************************************************
      Methods
      ****************************************************************/
    constructor(view : IView)
    {
        this._viewControllerNumber = ViewController._viewControllerCount++;
        this._view = view;
    }

    public addChildViewController(childVC : IViewController) : void
    {
        var childVCCasted: ViewController = <ViewController> childVC;
        if (this._childViewControllers.contains(childVCCasted))
        {
            throw new InvalidActionException('A child view controller can only be added once');
        }
        if (childVCCasted._parentViewController != null)
        {
            throw new InvalidActionException('Child view controller already has a parent');
        }
        this._childViewControllers.add(childVCCasted);
        childVCCasted._parentViewController = this;
    }
    public removeFromParentViewController() : void
    {
        if (this._parentViewController === null)
        {
            throw new InvalidActionException('The view controller has no parents');
        }
        this._parentViewController._childViewControllers.remove(this);
        this._parentViewController = null;
    }
    public toString() : string
    {
        return 'View Controller no. ' + this._viewControllerNumber;
    }
}

export = ViewController;

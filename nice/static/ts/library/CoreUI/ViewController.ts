/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import InvalidActionException = require('../Core/InvalidActionException');
import Set = require('../DataStructures/Set');
import IView = require('./IView');
import IViewController = require('./IViewController');

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
    get view() : IView
    {
        return this._view;
    }

    get parentViewController() : ViewController
    {
        return this._parentViewController;
    }

    get childViewControllers() : ViewController[]
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
        this.initialize();
    }

    /**
      * Do any initialization needed. Better than overriding constructor
      * because this gives the option of not calling super.initialize();
      */
    public initialize()
    {
    }

    public addChildViewController(childVC : ViewController) : void
    {
        if (this._childViewControllers.contains(childVC))
        {
            throw new InvalidActionException('A child view controller can only be added once');
        }
        if (childVC._parentViewController != null)
        {
            throw new InvalidActionException('Child view controller already has a parent');
        }
        this._childViewControllers.add(childVC);
        childVC._parentViewController = this;
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

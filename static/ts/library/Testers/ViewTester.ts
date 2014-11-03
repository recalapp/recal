import Set = require('../DataStructures/Set');
import View = require('../CoreUI/View');
import Tester = require('./Tester');

class ViewTester<T extends View> extends Tester
{
    private _view : T;

    constructor(prefixMessage: String, view : T)
    {
        super(prefixMessage);
        this._view = view;
    }

    run()
    {
        this._testAppend();
    }

    private _testAppend()
    {
        var childView : View = new View($('<div>'));

        // check if append works
        this._view.append(childView);
        var childrenSet = new Set<View>(this._view.children);
        this.assert(childrenSet.contains(childView), 'Appended view does not appear in the list of children');

        // check if parentView has been set
        this.assert(childView.parentView === this._view, 'parentView property does not reflect the change by append()');

        // check if a view can be added twice
        var passed = this.tryInvalidCommand(() =>
                {
                    this._view.append(childView);
                });
        this.assert(passed, 'View does not check if a child view is already a children');

        // check if a view with parent can be added
        var childViewTwo = new View($('<div>'));
        var parentView = new View($('<div>'));
        parentView.append(childViewTwo);
        var passed = this.tryInvalidCommand(() =>
                {
                    this._view.append(childViewTwo);
                });
        this.assert(passed, 'View does not check if a child view already has a parent');
    }

    private _testRemoveFromParent()
    {
        // assumes append() works
        var childView : View = new View($('<div>'));
        this._view.append(childView);

        // check if remove from parent works
        childView.removeFromParent();
        var childrenSet = new Set<View>(this._view.children);
        this.assert(!childrenSet.contains(childView), 'Removed view appears in the list of children');
        this.assert(childView.parentView === null, 'parentView is not set to null after removing from parent');

        // check if an exception is thrown if a view without parent calls removeFromParent()
        var passed = this.tryInvalidCommand(() =>
                {
                    childView.removeFromParent();
                });
        this.assert(passed, 'An exception is not thrown when a view without parent calls removeFromParent()');
    }
}

export = ViewTester;

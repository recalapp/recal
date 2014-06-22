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
        if (childrenSet.contains(childView))
        {
            this.fails('Appended view does not appear in the list of children');
        }
    }
}

export = ViewTester;

import Sidebar = require('../../../library/Sidebar/Sidebar');
import ViewController = require('../../../library/CoreUI/ViewController');

import ISidebarView = Sidebar.ISidebarView

class ReCalSidebarViewController extends ViewController
{
    constructor(sidebarView: ISidebarView)
    {
        super(sidebarView)
    }

    public get view(): ISidebarView
    {
        return <ISidebarView> this._view;
    }

    /**
      * Do any initialization needed. Better than overriding constructor
      * because this gives the option of not calling super.initialize();
      */
    public initialize(): void
    {
        
    }
}

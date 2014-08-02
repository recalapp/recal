import IView = require('./IView');

interface IViewController
{
    /******************************************************************
      Properties
      ****************************************************************/
    view: IView;

    parentViewController: IViewController;
    childViewControllers: IViewController[];

    /******************************************************************
      Methods
      ****************************************************************/
    /**
      * Do any initialization needed. Better than overriding constructor
      * because this gives the option of not calling super.initialize();
      */
    initialize(): void;

    addChildViewController(childVC: IViewController): void;
    removeFromParentViewController(): void;
}

export = IViewController;

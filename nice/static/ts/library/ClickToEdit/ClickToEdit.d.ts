import CoreUI = require('../CoreUI/CoreUI');

export interface IClickToEditView extends CoreUI.IFocusableView
{

}

export interface IClickToEditViewFactory 
{
    /**
      * Create a new ClickToEditView instance. $element must have data-cte_type
      * set to a number that correspondsto the enum representing 
      * clickToEditType.
      */
    createFromJQuery($element: JQuery): IClickToEditView;
}

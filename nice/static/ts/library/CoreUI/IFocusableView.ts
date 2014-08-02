import IView = require('./IView');

interface IFocusableView extends IView
{
    hasFocus: boolean;

    didFocus() : void
    didBlur() : void
}
export = IFocusableView;

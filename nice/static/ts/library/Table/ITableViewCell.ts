import IFocusableView = require('../CoreUI/IFocusableView');
import IndexPath = require('../DataStructures/IndexPath');

interface ITableViewCell extends IFocusableView
{
    indexPath: IndexPath;
    selected: boolean;

    highlight(): void;

    unhighlight(): void;
}
export = ITableViewCell;

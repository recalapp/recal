import FocusableView = require('../CoreUI/FocusableView');
import IndexPath = require('../Core/IndexPath');

class TableViewCell extends FocusableView
{
    private _indexPath: IndexPath = null;

    get indexPath() : IndexPath
    {
        return this._indexPath;
    }

    set indexPath(newValue: IndexPath) 
    {
        this._indexPath = newValue;
    }
}
export = TableViewCell;

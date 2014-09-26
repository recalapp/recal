import BrowserEvents = require('../Core/BrowserEvents');
import Dictionary = require('../DataStructures/Dictionary');
import Indicators = require('./Indicators');
import IndicatorView = require('./IndicatorView');
import InvalidActionException = require('../Core/InvalidActionException');
import View = require('../CoreUI/View');

class IndicatorsContainerView extends View implements Indicators.IIndicatorsContainerView
{
    private _indicatorViewsDict: Dictionary<string, IndicatorView> = new Dictionary<string, IndicatorView>();
    private get indicatorViewsDict(): Dictionary<string, IndicatorView> { return this._indicatorViewsDict; }

    constructor($element: JQuery, cssClass: string)
    {
        super($element, cssClass);
        /*
        setInterval(()=>
        {
            // TODO separate timer into a different module with support for pausing
            this.findChildrenJQuery(':not(.in)').each((index: number, element: Element)=>{
                var indicatorView = IndicatorView.fromJQuery($(element));
                indicatorView.removeFromParent();
            })
        }, 500)
        */
    }

    /**
     * Add the specified indicator view to the container. Throws an exception
     * if another indicator view with the same identifier was already added.
     * @param indicatorView
     */
    public addIndicatorView(indicatorView: IndicatorView): void
    {
        if (this.indicatorViewsDict.contains(indicatorView.identifier))
        {
            throw new InvalidActionException("Cannot add an indicator view with duplicate identifiers");
        }
        this.indicatorViewsDict.set(indicatorView.identifier, indicatorView);
        this.append(indicatorView);
        //indicatorView.addCssClass("in");
    }

    /**
     * Remove the indicator view with the identifier from the container. Throws
     * an exception if the identifier is invalid.
     * @param identifier
     */
    public removeIndicatorViewWithIdentifier(identifier: string): void
    {
        if (!this.indicatorViewsDict.contains(identifier))
        {
            throw new InvalidActionException("Cannot remove an indicator view that was never added.");
        }
        var indicatorView = this.indicatorViewsDict.get(identifier);
        this.indicatorViewsDict.unset(identifier);
        //indicatorView.removeCssClass('in');
        indicatorView.removeFromParent();
    }

}
export = IndicatorsContainerView;
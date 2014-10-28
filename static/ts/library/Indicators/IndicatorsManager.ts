import AssertionException = require('../Core/AssertionException');
import Dictionary = require('../DataStructures/Dictionary');
import Indicators = require('./Indicators');
import IndicatorsType = require('./IndicatorsType');
import IndicatorViewFactory = require('./IndicatorViewFactory');
import InvalidActionException = require('../Core/InvalidActionException');

import IIndicatorsContainerView = Indicators.IIndicatorsContainerView;

class IndicatorsManager implements Indicators.IIndicatorsManager
{
    private _identifierCountDict: Dictionary<string, number> = new Dictionary<string, number>();
    private get identifierCountDict(): Dictionary<string, number> { return this._identifierCountDict; }

    private _identifierTypeDict: Dictionary<string, IndicatorsType> = new Dictionary<string, IndicatorsType>();
    private get identifierTypeDict(): Dictionary<string, IndicatorsType> { return this._identifierTypeDict; }

    private _indicatorsContainerView: IIndicatorsContainerView = null;
    public get indicatorsContainerView(): IIndicatorsContainerView { return this._indicatorsContainerView; }
    public set indicatorsContainerView(value: IIndicatorsContainerView) { this._indicatorsContainerView = value; }

    private _indicatorViewFactory: IndicatorViewFactory = new IndicatorViewFactory();
    private get indicatorViewFactory(): IndicatorViewFactory { return this._indicatorViewFactory; }

    /**
     * Show an indicator with the specified type and identifier.
     * When an indicator is of type persistent, it stays on screen until
     * you explicitly hide it. Note that if this method is called twice with
     * the same identifier, then it must also be dismissed twice.
     * If the indicator is of type temporary, it automatically dismisses itself
     * after a certain amount of time. Calling it again causes it to stay
     * longer.
     * If the indicator is of type error, it stays until another indicator is
     * shown in its place.
     * @param identifier The unique identifier for this indicator
     * @param type The type of indicators
     * @param displayText The text on the indicator, not used if an indicator
     * of the same identifier already exists.
     */
    public showIndicator(identifier: string, type: IndicatorsType, displayText: string): void
    {
        var identifierCount = this.identifierCountDict.getOrCreate(identifier,
            0);
        if (identifierCount === 0)
        {
            this.identifierTypeDict.set(identifier, type);
            // create a new indicator view
            var indicatorView = this.indicatorViewFactory.createIndicatorView(type, identifier, displayText);
            this.indicatorsContainerView.addIndicatorView(indicatorView);
        }
        else
        {
            // handle the case where prev type is not the same as current type.
            var prevType = this.identifierTypeDict.get(identifier);
            if (prevType === null)
            {
                throw new AssertionException("Should never get here. Type dict should always be set.");
            }
            if (prevType !== type)
            {
                throw new InvalidActionException("Indicator with " + identifier + " is already of type " + prevType + " and cannot be redefined as type " + type);
            }
        }
        // increment count
        this.identifierCountDict.set(identifier, ++identifierCount);
    }

    /**
     * Hide the indicator with identifier. If a persistent indicator with
     * identifier has been shown twice (by calling show twice), this method
     * must also be called twice.
     * @param identifier
     */
    public hideIndicatorWithIdentifier(identifier: string): void
    {
        if (!this.identifierCountDict.contains(identifier))
        {
            throw new InvalidActionException("Cannot hide an indicator that does not exist");
        }
        var identifierCount = this.identifierCountDict.get(identifier) - 1;
        if (identifierCount === 0)
        {
            this.identifierCountDict.unset(identifier);
            this.identifierTypeDict.unset(identifier);
            this.indicatorsContainerView.removeIndicatorViewWithIdentifier(identifier);
        }
        else
        {
            this.identifierCountDict.set(identifier, identifierCount);
        }
    }
}
export = IndicatorsManager;
import CoreUI = require("../CoreUI/CoreUI");
import IndicatorView = require('./IndicatorView');
import IndicatorsType = require('./IndicatorsType');

import IView = CoreUI.IView;

export interface IIndicatorsContainerView extends IView
{
    /**
     * Add the specified indicator view to the container. Throws an exception
     * if another indicator view with the same identifier was already added.
     * @param indicatorView
     */
    addIndicatorView(indicatorView: IndicatorView): void

    /**
     * Remove the indicator view with the identifier from the container. Throws
     * an exception if the identifier is invalid.
     * @param identifier
     */
    removeIndicatorViewWithIdentifier(identifier: string): void;
}

export interface IIndicatorsManager
{
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
    showIndicator(identifier: string, type: IndicatorsType, displayText: string): void;

    /**
     * Hide the indicator with identifier. If a persistent indicator with
     * identifier has been shown twice (by calling show twice), this method
     * must also be called twice.
     * @param identifier
     */
    hideIndicatorWithIdentifier(identifier: string): void;
}
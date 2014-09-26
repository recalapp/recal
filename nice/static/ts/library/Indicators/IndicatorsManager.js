define(["require", "exports", '../Core/AssertionException', '../DataStructures/Dictionary', './IndicatorsType', './IndicatorViewFactory', '../Core/InvalidActionException'], function(require, exports, AssertionException, Dictionary, IndicatorsType, IndicatorViewFactory, InvalidActionException) {
    var IndicatorsManager = (function () {
        function IndicatorsManager() {
            this._identifierCountDict = new Dictionary();
            this._identifierTypeDict = new Dictionary();
            this._indicatorsContainerView = null;
            this._indicatorViewFactory = new IndicatorViewFactory();
        }
        Object.defineProperty(IndicatorsManager.prototype, "identifierCountDict", {
            get: function () {
                return this._identifierCountDict;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(IndicatorsManager.prototype, "identifierTypeDict", {
            get: function () {
                return this._identifierTypeDict;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(IndicatorsManager.prototype, "indicatorsContainerView", {
            get: function () {
                return this._indicatorsContainerView;
            },
            set: function (value) {
                this._indicatorsContainerView = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(IndicatorsManager.prototype, "indicatorViewFactory", {
            get: function () {
                return this._indicatorViewFactory;
            },
            enumerable: true,
            configurable: true
        });

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
        IndicatorsManager.prototype.showIndicator = function (identifier, type, displayText) {
            var identifierCount = this.identifierCountDict.getOrCreate(identifier, 0);
            if (identifierCount === 0) {
                this.identifierTypeDict.set(identifier, type);

                // create a new indicator view
                var indicatorView = this.indicatorViewFactory.createIndicatorView(type, identifier, displayText);
                this.indicatorsContainerView.addIndicatorView(indicatorView);
            } else {
                // handle the case where prev type is not the same as current type.
                var prevType = this.identifierTypeDict.get(identifier);
                if (prevType === null) {
                    throw new AssertionException("Should never get here. Type dict should always be set.");
                }
                if (prevType === 2 /* error */) {
                    // remove the error
                    this.hideIndicatorWithIdentifier(identifier);
                    identifierCount = 0; // reset count, gets incremented below

                    // create a new indicator view
                    var indicatorView = this.indicatorViewFactory.createIndicatorView(type, identifier, displayText);
                    this.indicatorsContainerView.addIndicatorView(indicatorView);
                    this.identifierTypeDict.set(identifier, type);
                } else if (prevType !== type) {
                    throw new InvalidActionException("If the indicator type is not error, it must be the same as the previous type.");
                }
            }

            // increment count
            this.identifierCountDict.set(identifier, ++identifierCount);
        };

        /**
        * Hide the indicator with identifier. If a persistent indicator with
        * identifier has been shown twice (by calling show twice), this method
        * must also be called twice.
        * @param identifier
        */
        IndicatorsManager.prototype.hideIndicatorWithIdentifier = function (identifier) {
            if (!this.identifierCountDict.contains(identifier)) {
                throw new InvalidActionException("Cannot hide an indicator that does not exist");
            }
            var identifierCount = this.identifierCountDict.get(identifier) - 1;
            if (identifierCount === 0) {
                this.identifierCountDict.unset(identifier);
                this.identifierTypeDict.unset(identifier);
                this.indicatorsContainerView.removeIndicatorViewWithIdentifier(identifier);
            } else {
                this.identifierCountDict.set(identifier, identifierCount);
            }
        };
        return IndicatorsManager;
    })();
    
    return IndicatorsManager;
});

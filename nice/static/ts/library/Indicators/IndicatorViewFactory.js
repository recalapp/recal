define(["require", "exports", './ErrorIndicatorView', "./IndicatorsType", '../Core/InvalidArgumentException', './PersistentIndicatorView', './TemporaryIndicatorView'], function(require, exports, ErrorIndicatorView, IndicatorsType, InvalidArgumentException, PersistentIndicatorView, TemporaryIndicatorView) {
    var IndicatorViewFactory = (function () {
        function IndicatorViewFactory() {
        }
        /**
        * Create a new indicator view of the given type, identifier, and display
        * text.
        * @param type
        * @param identifier
        * @param displayText
        */
        IndicatorViewFactory.prototype.createIndicatorView = function (type, identifier, displayText) {
            switch (type) {
                case 0 /* persistent */:
                    return new PersistentIndicatorView(identifier, displayText);
                    break;
                case 2 /* error */:
                    return new ErrorIndicatorView(identifier, displayText);
                    break;
                case 1 /* temporary */:
                    return new TemporaryIndicatorView(identifier, displayText);
                    break;
                default:
                    throw new InvalidArgumentException("type " + type + " is not a valid type");
            }
        };
        return IndicatorViewFactory;
    })();

    
    return IndicatorViewFactory;
});
//# sourceMappingURL=IndicatorViewFactory.js.map

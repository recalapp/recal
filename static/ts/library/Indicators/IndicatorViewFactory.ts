import ErrorIndicatorView = require('./ErrorIndicatorView');
import IndicatorView = require("./IndicatorView");
import IndicatorsType = require("./IndicatorsType");
import InvalidArgumentException = require('../Core/InvalidArgumentException');
import PersistentIndicatorView = require('./PersistentIndicatorView');
import TemporaryIndicatorView = require('./TemporaryIndicatorView');

class IndicatorViewFactory
{
    /**
     * Create a new indicator view of the given type, identifier, and display
     * text.
     * @param type
     * @param identifier
     * @param displayText
     */
    public createIndicatorView(type: IndicatorsType, identifier: string,
                               displayText: string): IndicatorView
    {
        switch (type)
        {
            case IndicatorsType.persistent:
                return new PersistentIndicatorView(identifier, displayText);
                break;
            case IndicatorsType.error:
                return new ErrorIndicatorView(identifier, displayText);
                break;
            case IndicatorsType.temporary:
                return new TemporaryIndicatorView(identifier, displayText);
                break;
            default:
                throw new InvalidArgumentException(
                        "type " + type + " is not a valid type");
        }
    }
}

export = IndicatorViewFactory;
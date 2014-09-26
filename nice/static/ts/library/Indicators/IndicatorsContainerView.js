var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../DataStructures/Dictionary', '../Core/InvalidActionException', '../CoreUI/View'], function(require, exports, Dictionary, InvalidActionException, View) {
    var IndicatorsContainerView = (function (_super) {
        __extends(IndicatorsContainerView, _super);
        function IndicatorsContainerView($element, cssClass) {
            _super.call(this, $element, cssClass);
            this._indicatorViewsDict = new Dictionary();
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
        Object.defineProperty(IndicatorsContainerView.prototype, "indicatorViewsDict", {
            get: function () {
                return this._indicatorViewsDict;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Add the specified indicator view to the container. Throws an exception
        * if another indicator view with the same identifier was already added.
        * @param indicatorView
        */
        IndicatorsContainerView.prototype.addIndicatorView = function (indicatorView) {
            if (this.indicatorViewsDict.contains(indicatorView.identifier)) {
                throw new InvalidActionException("Cannot add an indicator view with duplicate identifiers");
            }
            this.indicatorViewsDict.set(indicatorView.identifier, indicatorView);
            this.append(indicatorView);
            //indicatorView.addCssClass("in");
        };

        /**
        * Remove the indicator view with the identifier from the container. Throws
        * an exception if the identifier is invalid.
        * @param identifier
        */
        IndicatorsContainerView.prototype.removeIndicatorViewWithIdentifier = function (identifier) {
            if (!this.indicatorViewsDict.contains(identifier)) {
                throw new InvalidActionException("Cannot remove an indicator view that was never added.");
            }
            var indicatorView = this.indicatorViewsDict.get(identifier);
            this.indicatorViewsDict.unset(identifier);

            //indicatorView.removeCssClass('in');
            indicatorView.removeFromParent();
        };
        return IndicatorsContainerView;
    })(View);
    
    return IndicatorsContainerView;
});
//# sourceMappingURL=IndicatorsContainerView.js.map

/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', './ClickToEditBaseView', './ClickToEditCommon', './ClickToEditTextView', './ClickToEditTextAreaView', './ClickToEditType', '../Core/NotImplementedException', '../DataStructures/Set'], function(require, exports, $, ClickToEditBaseView, ClickToEditCommon, ClickToEditTextView, ClickToEditTextAreaView, ClickToEditType, NotImplementedException, Set) {
    var ClickToEditViewFactory = (function () {
        function ClickToEditViewFactory() {
            this._customTypes = new Set();
        }
        Object.defineProperty(ClickToEditViewFactory.prototype, "customTypes", {
            get: function () {
                return this._customTypes;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Create a new ClickToEditView instance. $element must have data-cte_type
        * set to a number that correspondsto the enum representing
        * clickToEditType.
        */
        ClickToEditViewFactory.prototype.createFromJQuery = function ($element) {
            var type = $element.data(ClickToEditCommon.DataType) || 0 /* text */;
            var clickToEditView = null;
            switch (type) {
                case 0 /* text */:
                    clickToEditView = ClickToEditTextView.fromJQuery($element);
                case 1 /* textArea */:
                    clickToEditView = ClickToEditTextAreaView.fromJQuery($element);
                default:
                    throw new NotImplementedException('ClickToEditType ' + type + ' is not supported');
            }
            if (!this.customTypes.contains(clickToEditView.inputType)) {
                // initialize the custom type
                this.customTypes.add(clickToEditView.inputType);

                // NOTE this = form in the context of functions
                $.editable.addInputType(clickToEditView.inputType, {
                    element: function (settings, original) {
                        // ok to do this because we assume the view is
                        // already initialized, so the created instance
                        // will be of the correct ClickToEdit type.
                        var view = ClickToEditBaseView.fromJQuery($(original));

                        // this in here refers to the form. we are using function(),
                        // not a lambda, so the context changes.
                        return view.element($(this), settings);
                    },
                    content: function (contentString, settings, original) {
                        var view = ClickToEditBaseView.fromJQuery($(original));
                        return view.content($(this), contentString, settings);
                    },
                    plugin: function (settings, original) {
                        var view = ClickToEditBaseView.fromJQuery($(original));
                        return view.plugin($(this), settings);
                    }
                });
            }
            return clickToEditView;
        };
        return ClickToEditViewFactory;
    })();
    
    return ClickToEditViewFactory;
});

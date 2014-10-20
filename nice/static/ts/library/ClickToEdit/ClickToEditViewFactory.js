/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', './ClickToEditBaseView', './ClickToEditCommon', './ClickToEditDateView', './ClickToEditSelectView', './ClickToEditTextView', './ClickToEditTextAreaView', './ClickToEditTimeView', './ClickToEditType', '../Core/NotImplementedException', '../DataStructures/Set'], function(require, exports, $, ClickToEditBaseView, ClickToEditCommon, ClickToEditDateView, ClickToEditSelectView, ClickToEditTextView, ClickToEditTextAreaView, ClickToEditTimeView, ClickToEditType, NotImplementedException, Set) {
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
            var type = $element.data(ClickToEditCommon.DataType) || ClickToEditType.text;
            if (!this.customTypes.contains(type)) {
                // initialize the custom type
                this.customTypes.add(type);

                // NOTE this = form in the context of functions
                $.editable.addInputType(type, {
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
            var clickToEditView = null;
            switch (type) {
                case ClickToEditType.text:
                    clickToEditView = ClickToEditTextView.fromJQuery($element);
                    break;
                case ClickToEditType.textArea:
                    clickToEditView = ClickToEditTextAreaView.fromJQuery($element);
                    break;
                case ClickToEditType.select:
                    clickToEditView = ClickToEditSelectView.fromJQuery($element);
                    break;
                case ClickToEditType.time:
                    clickToEditView = ClickToEditTimeView.fromJQuery($element);
                    break;
                case ClickToEditType.date:
                    clickToEditView = ClickToEditDateView.fromJQuery($element);
                    break;
                default:
                    throw new NotImplementedException('ClickToEditType ' + type + ' is not supported');
                    break;
            }

            return clickToEditView;
        };
        return ClickToEditViewFactory;
    })();
    
    return ClickToEditViewFactory;
});

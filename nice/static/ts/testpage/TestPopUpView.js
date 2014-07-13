/// <reference path="../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../library/ClickToEdit/ClickToEditViewFactory', '../library/PopUp/PopUpView'], function(require, exports, $, ClickToEditViewFactory, PopUpView) {
    var TestPopUpView = (function (_super) {
        __extends(TestPopUpView, _super);
        function TestPopUpView(view) {
            _super.call(this, view);
            this._$el.find('.clickToEdit').each(function (index, element) {
                var $element = $(element);
                var clickToEditView = ClickToEditViewFactory.instance().fromJQuery($element);
            });
        }
        return TestPopUpView;
    })(PopUpView);

    
    return TestPopUpView;
});

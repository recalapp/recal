/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../library/Table/TableViewCell', '../../library/CoreUI/ViewTemplateRetriever'], function(require, exports, TableViewCell, ViewTemplateRetriever) {
    var AgendaTableViewCell = (function (_super) {
        __extends(AgendaTableViewCell, _super);
        function AgendaTableViewCell() {
            _super.call(this, ViewTemplateRetriever.instance().retrieveTemplate(AgendaTableViewCell._templateSelector));
        }
        AgendaTableViewCell.prototype.hightlight = function () {
            var courseColor = this._$el.data('course-color');
            this._$el.find('#agenda-section').css('color', courseColor);
            this._$el.find('#agenda-title').css('color', courseColor);
            this._$el.addClass('panel-primary').removeClass('panel-default').css('border-color', courseColor);
        };

        AgendaTableViewCell.prototype.unhighlight = function () {
            var borderColor = this._$el.data('default-border-color');
            var defaultTextColor = this._$el.data('default-text-color');
            this._$el.addClass("panel-default").removeClass("panel-primary").css('border-color', borderColor);
            ;
            this._$el.find('#agenda-section').css('color', borderColor);
            this._$el.find('#agenda-title').css('color', defaultTextColor);
            this._$el.find('#agenda-section').css('color', defaultTextColor);
        };
        AgendaTableViewCell._templateSelector = '#agenda-template';
        return AgendaTableViewCell;
    })(TableViewCell);
});

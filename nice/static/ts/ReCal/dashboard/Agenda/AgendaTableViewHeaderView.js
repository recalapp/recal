/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Table/TableViewHeaderView', '../../common/GlobalInstancesManager'], function(require, exports, TableViewHeaderView, GlobalInstancesManager) {
    var AgendaTableViewHeaderView = (function (_super) {
        __extends(AgendaTableViewHeaderView, _super);
        function AgendaTableViewHeaderView() {
            _super.apply(this, arguments);
        }
        AgendaTableViewHeaderView.fromTemplate = function () {
            return this.fromJQuery(GlobalInstancesManager.instance.viewTemplateRetriever.retrieveTemplate(AgendaTableViewHeaderView._templateSelector));
        };

        AgendaTableViewHeaderView.prototype.setTitle = function (text) {
            this._$el.find('#agenda-header-text').text(text);
        };
        AgendaTableViewHeaderView._templateSelector = '#agenda-header-template';
        return AgendaTableViewHeaderView;
    })(TableViewHeaderView);

    
    return AgendaTableViewHeaderView;
});

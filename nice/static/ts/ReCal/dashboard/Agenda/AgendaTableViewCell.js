/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Table/TableViewCell'], function(require, exports, TableViewCell) {
    var AgendaTableViewCell = (function (_super) {
        __extends(AgendaTableViewCell, _super);
        function AgendaTableViewCell() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(AgendaTableViewCell.prototype, "eventId", {
            get: function () {
                return this._eventId;
            },
            enumerable: true,
            configurable: true
        });

        AgendaTableViewCell.prototype.highlight = function () {
            var courseColor = this._$el.data('course-color');
            if (courseColor === undefined) {
                courseColor = "#000000";
            }
            this._$el.find('#agenda-section').css('color', courseColor);
            this._$el.find('#agenda-title').css('color', courseColor);
            this._$el.find('.agenda-item').addClass('panel-primary').removeClass('panel-default').css('border-color', courseColor);
        };

        AgendaTableViewCell.prototype.unhighlight = function () {
            var borderColor = this._$el.data('default-border-color');
            var defaultTextColor = this._$el.data('default-text-color');
            if (borderColor === undefined) {
            }
            this._$el.find('.agenda-item').addClass("panel-default").removeClass("panel-primary").css('border-color', borderColor);
            ;
            this._$el.find('#agenda-section').css('color', borderColor);
            this._$el.find('#agenda-title').css('color', defaultTextColor);
            this._$el.find('#agenda-section').css('color', defaultTextColor);
        };

        AgendaTableViewCell.prototype.setToEvent = function (eventsModel) {
            // TODO timezone
            // TODO theme
            this._eventId = eventsModel.eventId;
            this._$el.find('.panel-body').find('h4').text(eventsModel.title);
            this._$el.find('#agenda-section').text(SECTION_MAP[eventsModel.sectionId]);

            var timeText = eventsModel.startDate.calendar();
            this._$el.find('#agenda-time').text(timeText);

            this._setColorForEvent(eventsModel);
        };

        AgendaTableViewCell.prototype._setColorForEvent = function (eventsModel) {
            var agendaColorClass = 'course-color-' + eventsModel.courseId;
            var courseColor = SECTION_COLOR_MAP[eventsModel.sectionId]['color'];
            this._$el.find('.agenda-tag').addClass(agendaColorClass).css('background-color', courseColor);
            this._$el.data('course-color', courseColor);

            var oldColor = this._$el.css('border-color');
            this._$el.data('default-border-color', oldColor);

            // TODO theme
            var darkerColor = 'rgba(0,0,0,0.4)';

            this._$el.data('default-text-color', darkerColor);
            this._$el.find('#agenda-section').addClass(agendaColorClass).css('color', darkerColor);
            this._$el.find('#agenda-title').addClass(agendaColorClass).css('color', darkerColor);
            // TODO special case for hidden events
        };
        AgendaTableViewCell.templateSelector = '#agenda-template';
        return AgendaTableViewCell;
    })(TableViewCell);

    
    return AgendaTableViewCell;
});

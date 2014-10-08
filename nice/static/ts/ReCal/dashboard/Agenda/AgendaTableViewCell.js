/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../library/Color/Color', '../../../library/Table/TableViewCell'], function(require, exports, Color, TableViewCell) {
    var AgendaTableViewCell = (function (_super) {
        __extends(AgendaTableViewCell, _super);
        function AgendaTableViewCell() {
            _super.apply(this, arguments);
            this._defaultBorderColor = null;
            this._defaultTextColor = null;
            this._color = null;
            this._eventId = null;
            this._possibleSections = [];
        }
        Object.defineProperty(AgendaTableViewCell.prototype, "defaultBorderColor", {
            get: function () {
                if (!this._defaultBorderColor) {
                    this._defaultBorderColor = Color.fromHex("#ddd");
                }
                return this._defaultBorderColor;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(AgendaTableViewCell.prototype, "defaultTextColor", {
            get: function () {
                if (!this._defaultTextColor) {
                    this._defaultTextColor = Color.fromHex("#666");
                }
                return this._defaultTextColor;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(AgendaTableViewCell.prototype, "color", {
            get: function () {
                if (!this._color) {
                    this._color = this._defaultBorderColor;
                }
                return this._color;
            },
            set: function (value) {
                this._color = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(AgendaTableViewCell.prototype, "eventId", {
            get: function () {
                return this._eventId;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(AgendaTableViewCell.prototype, "possibleSections", {
            get: function () {
                return this._possibleSections;
            },
            set: function (value) {
                this._possibleSections = value;
            },
            enumerable: true,
            configurable: true
        });

        AgendaTableViewCell.prototype.highlight = function () {
            this._$el.find('#agenda-section').css('color', this.color.hexValue);
            this._$el.find('#agenda-title').css('color', this.color.hexValue);
            this._$el.find('.agenda-item').addClass('panel-primary').removeClass('panel-default').css('border-color', this.color.hexValue);
        };

        AgendaTableViewCell.prototype.unhighlight = function () {
            this._$el.find('.agenda-item').addClass("panel-default").removeClass("panel-primary").css('border-color', this.defaultBorderColor.hexValue);
            this._$el.find('#agenda-section').css('color', this.defaultBorderColor.hexValue);
            this._$el.find('#agenda-title').css('color', this.defaultTextColor.hexValue);
            this._$el.find('#agenda-section').css('color', this.defaultTextColor.hexValue);
        };

        AgendaTableViewCell.prototype.setToEvent = function (eventsModel) {
            this._eventId = eventsModel.eventId;
            this._$el.find('.panel-body').find('h4').text(eventsModel.title);
            var sections = this.possibleSections.filter(function (sectionsModel) {
                return sectionsModel.sectionId === eventsModel.sectionId;
            });
            if (sections.length > 0) {
                this._$el.find('#agenda-section').text(sections[0].coursesModel.primaryListing + ' - ' + sections[0].title);
            }
            var timeText = eventsModel.startDate.calendar();
            this._$el.find('#agenda-time').text(timeText);
        };
        AgendaTableViewCell.templateSelector = '#agenda-template';
        return AgendaTableViewCell;
    })(TableViewCell);

    
    return AgendaTableViewCell;
});
//# sourceMappingURL=AgendaTableViewCell.js.map

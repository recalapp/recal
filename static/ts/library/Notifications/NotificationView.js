/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../CoreUI/FocusableView', './NotificationType', '../CoreUI/View'], function(require, exports, $, BrowserEvents, FocusableView, NotificationType, View) {
    var NotificationView = (function (_super) {
        __extends(NotificationView, _super);
        function NotificationView() {
            var _this = this;
            _super.call(this, NotificationView.template, NotificationView.cssClass);
            this._closeButton = null;
            this._type = null;
            this._message = null;
            this._identifier = null;
            this.closeButton = View.fromJQuery(this.findJQuery('#close_button'));
            this.closeButton.attachEventHandler(BrowserEvents.click, function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                _this.triggerEvent(BrowserEvents.notificationShouldRemove);
            });
            this.attachEventHandler(BrowserEvents.click, '#noti-content *', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                _this.triggerEvent(BrowserEvents.notificationShouldOpen);
            });
        }
        Object.defineProperty(NotificationView.prototype, "closeButton", {
            get: function () {
                return this._closeButton;
            },
            set: function (value) {
                this._closeButton = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(NotificationView.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (value) {
                var oldCssClass = NotificationView.getCssClassForType(this._type);
                this._type = value;
                var newCssClass = NotificationView.getCssClassForType(this._type);
                this._$el.removeClass(oldCssClass).addClass(newCssClass);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(NotificationView.prototype, "message", {
            get: function () {
                return this._message;
            },
            set: function (value) {
                if (this._message != value) {
                    this._message = value;
                    this.findJQuery('#noti-content').html('');
                    var $content = $('<a>').addClass('alert-link').text(this._message).on('click', function (ev) {
                        ev.preventDefault();
                    });
                    this.findJQuery('#noti-content').append($content);
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(NotificationView.prototype, "identifier", {
            get: function () {
                return this._identifier;
            },
            set: function (value) {
                this._identifier = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(NotificationView, "template", {
            get: function () {
                var $noti = $('<div>').addClass('alert').addClass('alert-dismissible');
                $noti.append('<button id="close_button" type="button" class="close" aria-hidden="true">&times;</button>');
                $('<span id="noti-content">').appendTo($noti);
                return $noti;
            },
            enumerable: true,
            configurable: true
        });

        NotificationView.getCssClassForType = function (type) {
            switch (type) {
                case 0 /* warning */:
                    return 'alert-warning';
                case 1 /* info */:
                    return 'alert-info';
            }
            return null;
        };

        Object.defineProperty(NotificationView, "cssClass", {
            get: function () {
                return FocusableView.cssClass + ' NotificationView';
            },
            enumerable: true,
            configurable: true
        });
        return NotificationView;
    })(FocusableView);

    
    return NotificationView;
});

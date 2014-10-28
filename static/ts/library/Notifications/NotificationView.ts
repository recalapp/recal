/// <reference path="../../typings/tsd.d.ts" />

import $ = require('jquery');

import BrowserEvents = require('../Core/BrowserEvents');
import FocusableView = require('../CoreUI/FocusableView');
import NotificationType = require('./NotificationType');
import View = require('../CoreUI/View');

class NotificationView extends FocusableView
{
    private _closeButton: View = null;
    private get closeButton(): View
    {
        return this._closeButton;
    }
    private set closeButton(value: View)
    {
        this._closeButton = value;
    }
    
    private _type: NotificationType = null;
    public get type(): NotificationType
    {
        return this._type;
    }
    public set type(value: NotificationType)
    {
        var oldCssClass = NotificationView.getCssClassForType(this._type);
        this._type = value;
        var newCssClass = NotificationView.getCssClassForType(this._type);
        this._$el.removeClass(oldCssClass).addClass(newCssClass);
    }

    private _message: string = null;
    public get message(): string
    {
        return this._message;
    }
    public set message(value: string)
    {
        if (this._message != value)
        {
            this._message = value;
            this.findJQuery('#noti-content').html('');
            var $content = $('<a>').addClass('alert-link').text(this._message).on('click', (ev: JQueryEventObject)=>{ ev.preventDefault(); });
            this.findJQuery('#noti-content').append($content);
        }
    }

    private _identifier: string = null;
    public get identifier(): string
    {
        return this._identifier;
    }
    public set identifier(value: string)
    {
        this._identifier = value;
    }

    private static get template(): JQuery
    {
        var $noti = $('<div>').addClass('alert').addClass('alert-dismissible');
        $noti.append('<button id="close_button" type="button" class="close" aria-hidden="true">&times;</button>');
        $('<span id="noti-content">').appendTo($noti);
        return $noti;
    }

    private static getCssClassForType(type: NotificationType): string
    {
        switch(type)
        {
            case NotificationType.warning:
                return 'alert-warning';
            case NotificationType.info:
                return 'alert-info';
        }
        return null;
    }

    public static get cssClass(): string
    {
        return FocusableView.cssClass + ' NotificationView';
    }
    constructor()
    {
        super(NotificationView.template, NotificationView.cssClass);
        this.closeButton = View.fromJQuery(this.findJQuery('#close_button'));
        this.closeButton.attachEventHandler(BrowserEvents.click, (ev: JQueryEventObject)=>
        {
            ev.stopPropagation();
            ev.preventDefault();
            this.triggerEvent(BrowserEvents.notificationShouldRemove);
        });
        this.attachEventHandler(BrowserEvents.click, '#noti-content *', (ev: JQueryEventObject)=>
        {
            ev.stopPropagation();
            ev.preventDefault();
            this.triggerEvent(BrowserEvents.notificationShouldOpen);
        });
    }
}

export = NotificationView;

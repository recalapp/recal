/// <reference path="typings/tsd.d.ts" />
import $ = require('jquery');

export class View 
{
    $el: JQuery; 
    constructor($el: JQuery)
    {
        this.$el = $el;
    }

    append(childView: View) : void 
    {
        this.$el.append(childView.$el);
    }
}

export class FocusableView extends View
{
    focusView() : void
    {
        this.$el.focus();
    }
    blurView() : void
    {
        this.$el.blur();
    }
}

export class ViewController
{
    view: View;
}

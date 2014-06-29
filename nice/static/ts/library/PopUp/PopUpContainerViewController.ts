/// <reference path="../../typings/tsd.d.ts" />
import $ = require('jquery');
import BrowserEvents = require('../Core/BrowserEvents');
import PopUpCommon = require('./PopUpCommon');
import PopUpView = require('./PopUpView');
import ViewController = require('../CoreUI/ViewController');

enum PopUpType { main, detached };

class PopUpContainerViewController extends ViewController
{
    constructor(view)
    {
        super(view);
        this.view.attachEventHandler(BrowserEvents.Events.mouseDown, '.popup', (ev: JQueryEventObject) =>
                {
                    ev.preventDefault();
                    var popUpView : PopUpView = <PopUpView> PopUpView.fromJQuery($(ev.target));
                    this.giveFocus(popUpView);
                });
    }

    /**
     * Give focus to its PopUpView and cause all other PopUps to lose focus
     */
    public giveFocus(popUpView : PopUpView) : void
    {
        // find a way to get all popups
    }
}

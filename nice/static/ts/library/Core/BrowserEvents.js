define(["require", "exports", './NotImplementedException'], function(require, exports, NotImplementedException) {
    function getEventName(ev) {
        switch (ev) {
            case 0 /* click */:
                return 'click';
            case 1 /* mouseDown */:
                return 'mousedown';
            case 2 /* viewWasAppended */:
                return 'viewWasAppended';
            case 3 /* viewWasRemoved */:
                return 'viewWasRemoved';
            case 4 /* viewWillFocus */:
                return 'viewWillFocus';
            case 5 /* viewDidFocus */:
                return 'viewDidFocus';
            case 6 /* viewWillBlur */:
                return 'viewWillBlur';
            case 7 /* viewDidBlur */:
                return 'viewDidBlur';
            case 8 /* popUpWillDetach */:
                return 'popUp_willDetach';
            default:
                throw new NotImplementedException(ev + ' is not supported');
        }
    }
    exports.getEventName = getEventName;
    (function (Events) {
        Events[Events["click"] = 0] = "click";
        Events[Events["mouseDown"] = 1] = "mouseDown";

        // View
        Events[Events["viewWasAppended"] = 2] = "viewWasAppended";
        Events[Events["viewWasRemoved"] = 3] = "viewWasRemoved";
        Events[Events["viewWillFocus"] = 4] = "viewWillFocus";
        Events[Events["viewDidFocus"] = 5] = "viewDidFocus";
        Events[Events["viewWillBlur"] = 6] = "viewWillBlur";
        Events[Events["viewDidBlur"] = 7] = "viewDidBlur";

        // PopUp
        Events[Events["popUpWillDetach"] = 8] = "popUpWillDetach";
    })(exports.Events || (exports.Events = {}));
    var Events = exports.Events;
});

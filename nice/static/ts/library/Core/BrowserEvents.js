define(["require", "exports", './NotImplementedException'], function(require, exports, NotImplementedException) {
    function getEventName(ev) {
        switch (ev) {
            case 0 /* click */:
                return 'click';
            case 1 /* viewWasAppended */:
                return 'viewWasAppended';
            case 2 /* mouseDown */:
                return 'mousedown';
            default:
                throw new NotImplementedException(ev + ' is not supported');
        }
    }
    exports.getEventName = getEventName;
    (function (Events) {
        Events[Events["click"] = 0] = "click";
        Events[Events["viewWasAppended"] = 1] = "viewWasAppended";
        Events[Events["mouseDown"] = 2] = "mouseDown";
    })(exports.Events || (exports.Events = {}));
    var Events = exports.Events;
});

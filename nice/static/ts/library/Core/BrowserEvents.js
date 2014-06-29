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
            default:
                throw new NotImplementedException(ev + ' is not supported');
        }
    }
    exports.getEventName = getEventName;
    (function (Events) {
        Events[Events["click"] = 0] = "click";
        Events[Events["mouseDown"] = 1] = "mouseDown";
        Events[Events["viewWasAppended"] = 2] = "viewWasAppended";
        Events[Events["viewWasRemoved"] = 3] = "viewWasRemoved";
    })(exports.Events || (exports.Events = {}));
    var Events = exports.Events;
});

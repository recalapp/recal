define(["require", "exports"], function(require, exports) {
    var BrowserEvents;
    (function (BrowserEvents) {
        BrowserEvents[BrowserEvents["click"] = 0] = "click";
        BrowserEvents[BrowserEvents["viewWasAppended"] = 1] = "viewWasAppended";
    })(BrowserEvents || (BrowserEvents = {}));
    
    return BrowserEvents;
});

define(["require", "exports"], function(require, exports) {
    var CompositeEventSources = (function () {
        function CompositeEventSources() {
            this.id = 0;
            this.myChildren = {};
            // this.myEventSources = [];
        }
        /**
        * returns an array of IEventSource
        */
        CompositeEventSources.prototype.getEventSources = function () {
            var eventSources = [];
            for (var key in this.myChildren) {
                if (this.myChildren.hasOwnProperty(key)) {
                    eventSources.push.apply(eventSources, this.myChildren[key].getEventSources());
                }
            }

            return eventSources;
        };

        CompositeEventSources.prototype.addEventSources = function (eventSources) {
            this.myChildren[eventSources.id] = eventSources;
            // this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
        };

        CompositeEventSources.prototype.removeEventSources = function (eventSourcesId) {
            delete this.myChildren[eventSourcesId];
        };
        return CompositeEventSources;
    })();
});

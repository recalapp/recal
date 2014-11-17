define(["require", "exports"], function(require, exports) {
    var CompositeEventSources = (function () {
        // private idxMap: { [id: number] : number[] };
        function CompositeEventSources() {
            this.isPreview = false;
            this.id = -1;
            this.myChildren = {};
            this.myEventSources = [];
            // this.idxMap = {};
        }
        /**
        * returns an array of IEventSource
        */
        CompositeEventSources.prototype.getEventSources = function () {
            return this.myEventSources;
        };

        CompositeEventSources.prototype.addEventSources = function (eventSources) {
            if (this.myChildren[eventSources.id]) {
                // this means we are updating an eventSources
                // should first remove it
                this.removeEventSources(eventSources.id, true);
            }

            this.myChildren[eventSources.id] = eventSources;
            var start = this.myEventSources.length;
            var length = eventSources.getEventSources().length;
            var end = start + length - 1;
            this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
            // this.idxMap[eventSources.id] = [start, end];
        };

        // eventSourcesId is the course id
        CompositeEventSources.prototype.removeEventSources = function (eventSourcesId, isPreview) {
            var courseEventSources = this.myChildren[eventSourcesId];

            // only remove if isPreview matches
            if (courseEventSources.isPreview != isPreview) {
                return;
            }

            var eventSources = courseEventSources.getEventSources();
            for (var i = this.myEventSources.length - 1; i >= 0; i--) {
                var currSectionEventSource = this.myEventSources[i];
                for (var j = 0; j < eventSources.length; j++) {
                    if (currSectionEventSource.id == eventSources[j].id) {
                        this.myEventSources.splice(i, 1);
                    }
                }
            }

            delete this.myChildren[eventSourcesId];
            // delete this.idxMap[eventSourcesId];
        };
        return CompositeEventSources;
    })();

    
    return CompositeEventSources;
});

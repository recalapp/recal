define(["require", "exports"], function(require, exports) {
    var CompositeEventSources = (function () {
        // private idxMap: { [id: number] : number[] };
        function CompositeEventSources() {
            this.id = 0;
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
            this.myChildren[eventSources.id] = eventSources;
            var start = this.myEventSources.length;
            var length = eventSources.getEventSources().length;
            var end = start + length - 1;
            this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
            // this.idxMap[eventSources.id] = [start, end];
        };

        // eventSourcesId is the course id
        CompositeEventSources.prototype.removeEventSources = function (eventSourcesId) {
            // var start = this.idxMap[eventSourcesId][0];
            // var end = this.idxMap[eventSourcesId][1];
            // for (var i = start; i <= end; i++) {
            //     var curr = this.myEventSources[i];
            //     this.myEventSources[i] = null;
            // }
            var eventSources = this.myChildren[eventSourcesId].getEventSources();
            for (var i = this.myEventSources.length - 1; i >= 0; i--) {
                var curr = this.myEventSources[i];
                for (var j = 0; j < eventSources.length; j++) {
                    if (curr.id == eventSources[j].id) {
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

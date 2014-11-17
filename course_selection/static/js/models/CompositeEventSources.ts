import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');

class CompositeEventSources implements IEventSources {
    // my Children is a map of id to EventSources
    private myChildren: { [id: number]: IEventSources};
    private myEventSources: IEventSource[];
    public id: number;
    // private idxMap: { [id: number] : number[] };

    constructor() {
        this.id = 0;
        this.myChildren = {};
        this.myEventSources = [];
        // this.idxMap = {};
    }

    /**
     * returns an array of IEventSource
     */
    public getEventSources(): IEventSource[] {
        return this.myEventSources;
    }

    public addEventSources(eventSources: IEventSources): void {
        this.myChildren[eventSources.id] = eventSources;
        var start: number = this.myEventSources.length;
        var length: number = eventSources.getEventSources().length;
        var end = start + length - 1;
        this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
        // this.idxMap[eventSources.id] = [start, end];
    }

    // eventSourcesId is the course id
    public removeEventSources(eventSourcesId: number): void {
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
    }
}

export = CompositeEventSources;

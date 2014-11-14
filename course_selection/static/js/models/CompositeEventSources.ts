import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');

class CompositeEventSources implements IEventSources {
    // my Children is a map of id to EventSources
    private myChildren: any;
    //private myEventSources: IEventSource[];
    public id: number;

    constructor() {
        this.id = 0;
        this.myChildren = {};
        // this.myEventSources = [];
    }

    /**
     * returns an array of IEventSource
     */
    public getEventSources(): IEventSource[] {
        var eventSources = [];
        for (var key in this.myChildren) {
            if (this.myChildren.hasOwnProperty(key)) {
                eventSources.push.apply(eventSources, this.myChildren[key].getEventSources());
            }
        }

        return eventSources;
    }

    public addEventSources(eventSources: IEventSources): void {
        this.myChildren[eventSources.id] = eventSources;
        // this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
    }

    public removeEventSources(eventSourcesId: number): void {
        delete this.myChildren[eventSourcesId];
    }
}

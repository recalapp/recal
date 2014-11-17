import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');

class CompositeEventSources implements IEventSources {
    // my Children is a map of id to EventSources
    private myChildren: { [id: number]: IEventSources};
    private myEventSources: IEventSource[];
    public isPreview: boolean;
    public id: number;
    // private idxMap: { [id: number] : number[] };

    constructor() {
        this.isPreview = false;
        this.id =  -1;
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
        if (this.myChildren[eventSources.id]) {
            // this means we are updating an eventSources
            // should first remove it
            this.removeEventSources(eventSources.id, true);
        }

        this.myChildren[eventSources.id] = eventSources;
        var start: number = this.myEventSources.length;
        var length: number = eventSources.getEventSources().length;
        var end = start + length - 1;
        this.myEventSources.push.apply(this.myEventSources, eventSources.getEventSources());
        // this.idxMap[eventSources.id] = [start, end];
    }

    // eventSourcesId is the course id
    public removeEventSources(eventSourcesId: number, isPreview: boolean): void {
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
    }
}

export = CompositeEventSources;

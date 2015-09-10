import IEventSource = require('./IEventSource');

interface IEventSources {
    id: number;
    isPreview: boolean;
    getEventSources(): IEventSource[];
}

export = IEventSources;

import IEventSource = require('./IEventSource');

interface IEventSources {
    id: number;
    getEventSources(): IEventSource[];
}

export = IEventSources;

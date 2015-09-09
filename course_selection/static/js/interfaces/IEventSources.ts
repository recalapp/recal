import IEventSource = require('./IEventSource');

interface IEventSources {
    id: string; // unique identifier--usually concatenation of course_id and username
    isPreview: boolean;
    getEventSources(): IEventSource[];
}

export = IEventSources;

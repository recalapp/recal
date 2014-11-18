import IEvent = require('./IEvent');

interface IEventSource {
    id: number;
    events: IEvent[];
    color: string;
    section_type: string;
}

export = IEventSource;

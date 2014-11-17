import IEvent = require('./IEvent');

interface IEventSource {
    id: number;
    events: IEvent[];
    color: string;
}

export = IEventSource;

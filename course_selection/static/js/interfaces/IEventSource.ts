import IEvent = require('./IEvent');

interface IEventSource {
    id: number;
    getEvents(): IEvent[];
}

export = IEventSource;

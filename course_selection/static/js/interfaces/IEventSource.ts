import IEvent = require('./IEvent');

interface IEventSource {
    id: number;
    events: IEvent[];
    textColor: string;
    backgroundColor: string;
    section_type: string;
    course_id: number;
}

export = IEventSource;

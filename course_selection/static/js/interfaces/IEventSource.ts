import IEvent = require('./IEvent');

interface IEventSource {
    id: number;
    events: IEvent[];
    textColor: string;
    borderColor: string;
    backgroundColor: string;
    className: string;
    section_type: string;
    course_id: number;
}

export = IEventSource;

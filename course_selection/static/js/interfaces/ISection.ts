import IMeeting = require('./IMeeting');

interface ISection {
    id: number;
    name: string;
    section_type: string;
    meetings: Array<IMeeting>;
    has_meetings: boolean;
    section_capacity: number;
    section_enrollment: number;
    course_id: number;
}

export = ISection;

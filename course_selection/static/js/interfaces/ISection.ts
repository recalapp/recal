import IMeeting = require('./IMeeting');

interface ISection {
    id: number;
    name: string;
    section_type: string;
    meetings: Array<IMeeting>;
    has_meetings: boolean;
    course_id: number;
}

export = ISection;

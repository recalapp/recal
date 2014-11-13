import IMeeting = require('./IMeeting');

interface ISection {
    id: number;
    name: string;
    section_type: string;
    meetings: Array<IMeeting>;
    course_id: number;
}

export = ISection;

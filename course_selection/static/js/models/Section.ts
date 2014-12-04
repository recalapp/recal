import ISection = require("../interfaces/ISection");
import IMeeting = require("../interfaces/IMeeting");

class Section implements ISection {
    id: number;
    name: string;
    section_type: string;
    meetings: Array<IMeeting>;
    has_meetings: boolean;
    course_id: number;

    constructor(
            id,
            name,
            section_type,
            meetings,
            course_uri)
    {
        this.id = id;
        this.name = name;
        this.section_type = section_type;
        this.meetings = meetings;
        this.has_meetings = this.meetings.length > 0 
            && this.meetings[0].days != '';

        var course_uri_arr = course_uri.split('/');
        this.course_id = course_uri_arr[course_uri_arr.length - 2]; 
    }
}

export = Section;

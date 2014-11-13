import ISection = require("../interfaces/ISection");
import IMeeting = require("../interfaces/IMeeting");

class Section implements ISection {
    id: number;
    name: string;
    section_type: string;
    meetings: Array<IMeeting>;
    course_id: number;
    constructor(
            id,
            name,
            section_type,
            meetings,
            course)
    {
        this.id = id;
        this.name = name;
        this.section_type = section_type;
        this.meetings = meetings;

        var course_url = course.split('/');
        this.course_id = course_url[course_url.length - 2]; 
    }
}

export = Section;

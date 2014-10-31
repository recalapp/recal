import ISection = require('./ISection');
import ISemester = require('./ISemester');

interface ICourse {
    title: string;
    description: string;
    course_listings: string[];
    id: number;
    sections: Array<ISection>;
    semester: ISemester;
}

export = ICourse;

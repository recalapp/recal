import ISection = require('./ISection');
import ISemester = require('./ISemester');

interface ICourse {
    title: string;
    description: string;
    course_listings: Array<any>;
    id: number;
    sections: Array<ISection>;
    semester: ISemester;
}

export = ICourse;

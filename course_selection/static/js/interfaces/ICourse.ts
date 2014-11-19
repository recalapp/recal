import ISection = require('./ISection');
import ISemester = require('./ISemester');
import ICourseListing = require('./ICourseListing');
import IColorPalette = require('./IColorPalette');

interface ICourse {
    title: string;
    description: string;
    course_listings: Array<ICourseListing>;
    id: number;
    sections: Array<ISection>;
    semester: ISemester;
    primary_listing: string;
    all_listings: string;
    section_types: Array<string>;
    rating: number;
    colors: IColorPalette;
    getSectionById(number): ISection;
}

export = ICourse;

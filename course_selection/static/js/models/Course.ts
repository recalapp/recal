import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import ISemester = require('../interfaces/ISemester');
import ICourseListing = require('../interfaces/ICourseListing');
import Section = require('../models/Section');

class Course implements ICourse {
    public title: string;
    public description: string;
    public course_listings: Array<ICourseListing>;
    public id: number;
    public sections: Array<ISection>;
    public semester: ISemester;
    public primary_listing: string;
    public all_listings: string;
    public section_types: Array<string>;

    constructor(title, description, course_listings,
            id, sections, semester) {
        this.title = title;
        this.description = description;
        this.course_listings = course_listings;
        this.id = id;
        this.semester = semester;

        this.sections = this.getSections(sections);
        this.primary_listing = this.getPrimaryCourseListing();
        this.all_listings = this.getAllCourseListings();
        this.section_types = this.getSectionTypes();
    }

    private getSections(input): Array<ISection> {
        var sections = [];
        for (var i = 0; i < input.length; i++) {
            var curr = input[i];
            var section = new Section(curr.id,
                    curr.name, curr.section_type,
                    curr.meetings, curr.course);
            sections.push(section);
        }

        return sections;
    }
    
    private getPrimaryCourseListing(): string {
        for (var i = 0; i < this.course_listings.length; i++) {
            var curr = this.course_listings[i];
            if (curr.is_primary) {
                return curr.dept + curr.number;
            }
        }

        return "";
    }

    private getAllCourseListings(): string {
        var listings = [];
        for (var i = 0; i < this.course_listings.length; i++) {
            var curr = this.course_listings[i];
            if (curr.is_primary) {
                listings.unshift(curr.dept + curr.number);
            } else {
                listings.push(curr.dept + curr.number);
            }
        }

        return listings.join(' / ');
    }

    private getSectionTypes(): Array<string> {
        var section_types = [];
        for (var i = 0; i < this.sections.length; i++) {
            var curr_type = this.sections[i].section_type;
            if (!this.inArray(curr_type, section_types)) {
                section_types.push(curr_type);
            }
        }

        return section_types;
    }

    private inArray(s: string, arr: Array<string>): boolean {
        return arr.indexOf(s) != -1;
    }
}

export = Course;

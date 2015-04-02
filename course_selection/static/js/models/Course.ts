import ColorResource = require('../services/ColorResource');
import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import ISemester = require('../interfaces/ISemester');
import ICourseListing = require('../interfaces/ICourseListing');
import IColorPalette = require('../interfaces/IColorPalette');
import Section = require('../models/Section');

class Course implements ICourse {
    private static EASYPCE_BASE_URL: string = "http://easypce.com/courses/";
    private static REGISTRAR_BASE_URL: string = "https://registrar.princeton.edu/course-offerings/course_details.xml?";
    private static REGISTRAR_ID_DIGITS: number = 6;

    public title: string;
    public description: string;
    public course_listings: Array<ICourseListing>;
    public id: number;
    public registrar_id: number;
    public sections: Array<ISection>;
    public semester: ISemester;
    public primary_listing: string;
    public all_listings: string;
    public section_types: Array<string>;
    public colors: IColorPalette;
    public enrolled: boolean;
    public rating: number;
    public easypce_link: string;
    public registrar_link: string;

    constructor(title, description, course_listings,
            id, registrar_id, sections, semester, enrolled?: boolean) {
        this.title = title;
        this.description = description;
        this.course_listings = course_listings;
        this.id = id;

        // chop off the first 4 digits for registar_id
        // the first 4 digits are the term code
        this.registrar_id = registrar_id.substring(registrar_id.length - Course.REGISTRAR_ID_DIGITS);

        this.semester = semester;

        this.sections = this.getSections(sections);
        this.primary_listing = this.getPrimaryCourseListing();
        this.all_listings = this.getAllCourseListings();
        this.section_types = this.getSectionTypes();
        this.colors = ColorResource.previewColor;
        this.rating = +(Math.random() * 2 + 3).toPrecision(3);
        this.enrolled = enrolled ? enrolled : false;
        this.easypce_link = Course.EASYPCE_BASE_URL + this.primary_listing;
        this.registrar_link = this.getRegistrarLink();
    }

    private getRegistrarLink(): string {
        return Course.REGISTRAR_BASE_URL + "courseid=" 
            + this.registrar_id + "&term=" + this.semester.term_code;
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

    public resetColor() {
        this.colors = this._getDefaultColor();
    }

    private _getDefaultColor() {
        return ColorResource.previewColor;
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

    public getSectionById(section_id: number): ISection {
        return this.sections.filter((section) => {
            return section.id == section_id;
        })[0];
    }
}

export = Course;

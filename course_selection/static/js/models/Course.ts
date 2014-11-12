import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import ISemester = require('../interfaces/ISemester');
import ICourseListing = require('../interfaces/ICourseListing');

class Course implements ICourse {
    public title: string;
    public description: string;
    public course_listings: Array<ICourseListing>;
    public id: number;
    public sections: Array<ISection>;
    public semester: ISemester;
    public primary_listing: string;
    public all_listings: string;

    constructor(title, description, course_listings,
            id, sections, semester) {
        this.title = title;
        this.description = description;
        this.course_listings = course_listings;
        this.id = id;
        this.sections = sections;
        this.semester = semester;
        this.primary_listing = this.getPrimaryCourseListing();
        this.all_listings = this.getAllCourseListings();
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
}

export = Course;

define(["require", "exports", '../models/Section'], function(require, exports, Section) {
    var Course = (function () {
        function Course(title, description, course_listings, id, sections, semester) {
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
        Course.prototype.getSections = function (input) {
            var sections = [];
            for (var i = 0; i < input.length; i++) {
                var curr = input[i];
                var section = new Section(curr.id, curr.name, curr.section_type, curr.meetings, curr.course);
                sections.push(section);
            }

            return sections;
        };

        Course.prototype.getPrimaryCourseListing = function () {
            for (var i = 0; i < this.course_listings.length; i++) {
                var curr = this.course_listings[i];
                if (curr.is_primary) {
                    return curr.dept + curr.number;
                }
            }

            return "";
        };

        Course.prototype.getAllCourseListings = function () {
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
        };

        Course.prototype.getSectionTypes = function () {
            var section_types = [];
            for (var i = 0; i < this.sections.length; i++) {
                var curr_type = this.sections[i].section_type;
                if (!this.inArray(curr_type, section_types)) {
                    section_types.push(curr_type);
                }
            }

            return section_types;
        };

        Course.prototype.inArray = function (s, arr) {
            return arr.indexOf(s) != -1;
        };

        Course.prototype.getSectionById = function (section_id) {
            return this.sections.filter(function (section) {
                return section.id == section_id;
            })[0];
        };
        return Course;
    })();

    
    return Course;
});

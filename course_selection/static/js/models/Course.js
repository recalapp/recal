define(["require", "exports", '../services/ColorResource', '../models/Section'], function(require, exports, ColorResource, Section) {
    var Course = (function () {
        function Course(title, description, course_listings, id, sections, semester, enrolled) {
            this.title = title;
            this.description = description;
            this.course_listings = course_listings;
            this.id = id;
            this.semester = semester;

            this.sections = this.getSections(sections);
            this.primary_listing = this.getPrimaryCourseListing();
            this.all_listings = this.getAllCourseListings();
            this.section_types = this.getSectionTypes();
            this.colors = ColorResource.previewColor;
            this.rating = +(Math.random() * 2 + 3).toPrecision(3);
            this.enrolled = enrolled ? enrolled : false;
            this.easypce_link = Course.EASYPCE_BASE_URL + this.primary_listing;
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

        Course.prototype.resetColor = function () {
            this.colors = this._getDefaultColor();
        };

        Course.prototype._getDefaultColor = function () {
            return ColorResource.previewColor;
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
        Course.EASYPCE_BASE_URL = "http://easypce.com/courses/";
        return Course;
    })();

    
    return Course;
});

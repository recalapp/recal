define(["require", "exports"], function(require, exports) {
    var Course = (function () {
        function Course(title, description, course_listings, id, sections, semester) {
            this.title = title;
            this.description = description;
            this.course_listings = course_listings;
            this.id = id;
            this.sections = sections;
            this.semester = semester;
            this.primary_listing = this.getPrimaryCourseListing();
            this.all_listings = this.getAllCourseListings();
        }
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
        return Course;
    })();

    
    return Course;
});

define(["require", "exports"], function(require, exports) {
    var Section = (function () {
        function Section(id, name, section_type, meetings, course) {
            this.id = id;
            this.name = name;
            this.section_type = section_type;
            this.meetings = meetings;

            var course_url = course.split('/');
            this.course_id = course_url[course_url.length - 2];
        }
        return Section;
    })();

    
    return Section;
});
//# sourceMappingURL=Section.js.map

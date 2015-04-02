define(["require", "exports"], function(require, exports) {
    var Section = (function () {
        function Section(id, name, section_type, meetings, course_uri) {
            this.id = id;
            this.name = name;
            this.section_type = section_type;
            this.meetings = meetings;
            this.has_meetings = this.meetings.length > 0 && this.meetings[0].days != '';

            var course_uri_arr = course_uri.split('/');
            this.course_id = course_uri_arr[course_uri_arr.length - 2];
        }
        return Section;
    })();

    
    return Section;
});
//# sourceMappingURL=Section.js.map

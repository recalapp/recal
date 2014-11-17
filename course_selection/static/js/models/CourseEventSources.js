define(["require", "exports", './SectionEventSource'], function(require, exports, SectionEventSource) {
    var CourseEventSources = (function () {
        function CourseEventSources(course, colors) {
            this.myCourse = course;
            this.id = course.id;
            this.myColors = colors;
            this.initEventSources();
        }
        CourseEventSources.prototype.initEventSources = function () {
            var sections = this.myCourse.sections;
            var eventSources = [];
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                var eventSource = new SectionEventSource(section, this.myCourse, this.myColors.light);
                eventSources.push(eventSource);
            }

            this.sectionEventSources = eventSources;
        };

        CourseEventSources.prototype.getEventSources = function () {
            return this.sectionEventSources;
        };
        return CourseEventSources;
    })();

    
    return CourseEventSources;
});
//# sourceMappingURL=CourseEventSources.js.map
